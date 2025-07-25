import type { APIRoute } from "astro";
import { validateEmail, validatePhone } from "../../lib/common";
import { cache } from '../../lib/cache';
import { secrets } from '../../lib/secrets';
import { ServiceUnavailableError } from "../../lib/error";
import type { CachedResponse } from "../../lib/constants";

const DEV = process.env.NODE_ENV !== 'production';

const EMAIL_VALIDATION_API_KEY = !DEV && Object.keys(secrets).length ? secrets.EMAIL_VALIDATION_API_KEY : import.meta.env.EMAIL_VALIDATION_API_KEY;
const EMAIL_VALIDATION_API_BASE = !DEV ? process.env.EMAIL_VALIDATION_API_BASE : import.meta.env.EMAIL_VALIDATION_API_BASE;
const PHONE_VALIDATION_API_KEY = !DEV && Object.keys(secrets).length ? secrets.PHONE_VALIDATION_API_KEY : import.meta.env.PHONE_VALIDATION_API_KEY;
const PHONE_VALIDATION_API_BASE = !DEV ? process.env.PHONE_VALIDATION_API_BASE : import.meta.env.PHONE_VALIDATION_API_BASE;

console.log(Object.keys(secrets))

export const POST: APIRoute = async ({ request }) => {
    const form = await request.json();

    const cachedResult = await cache.hasEntry(form.value) as CachedResponse;
    
    if (cachedResult) {
        if (!cachedResult.error) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        return new Response(JSON.stringify({
            error: cachedResult.error
        }), { status: 400 });
    } 
    
    if (!form.resource || !form.value) {
        return new Response(JSON.stringify({
            error: 'Must provide a resource and value to validate'
        }), { status: 401 });
    }

    let caughtErr;

    try {
        if (form.resource === 'email' && form.value.length) {
            await validateEmail(form.value, EMAIL_VALIDATION_API_KEY, EMAIL_VALIDATION_API_BASE, (form.options.strict || false));
        } else if (form.resource === 'phone' && form.value.length) {
            await validatePhone(form.value, PHONE_VALIDATION_API_KEY, PHONE_VALIDATION_API_BASE);
        }
    } catch (err) {
        console.error(err);
        caughtErr = err;
    } finally {
        if (!caughtErr || !(caughtErr instanceof ServiceUnavailableError)) {
            await cache.saveEntry(form.value, JSON.stringify({
                error: caughtErr ? (caughtErr as Error).message : false
            }));
        }
    }

    if (caughtErr) {
        return new Response(JSON.stringify({
            error: (caughtErr as Error).message,
        }), { status: caughtErr instanceof ServiceUnavailableError ? 503 : 400 });
    }
    
    return new Response(JSON.stringify({
        success: true
    }), { status: 200 });
}