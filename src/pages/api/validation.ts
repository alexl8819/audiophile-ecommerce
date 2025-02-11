import type { APIRoute } from "astro";
import { validateEmail, validatePhone } from "../../lib/common";
import { ServiceUnavailableError } from "../../lib/error";

// TODO: implement cache to reduce validation load upstream

export const POST: APIRoute = async ({ request }) => {
    const form = await request.json();

    if (form.resource === 'email' && form.value.length) {
        try {
            await validateEmail(form.value, import.meta.env.EMAIL_VALIDATION_API_KEY, import.meta.env.EMAIL_VALIDATION_BASE_API, (form.options.strict || false));
        } catch (err) {
            return new Response(JSON.stringify({
                error: (err as Error).message,
            }), { status: err instanceof ServiceUnavailableError ? 503 : 400 });
        }
    } else if (form.resource === 'phone' && form.value.length) {
        try {
            await validatePhone(form.value, import.meta.env.PHONE_VALIDATION_API_KEY, import.meta.env.PHONE_VALIDATION_BASE_API);
        } catch (err) {
            return new Response(JSON.stringify({
                error: (err as Error).message
            }), { status: err instanceof ServiceUnavailableError ? 503 : 400 });
        }
    } else {
        return new Response(JSON.stringify({
            error: 'Must provide a resource to validate'
        }), { status: 401 })
    }

    return new Response(JSON.stringify({
        success: true
    }), { status: 200 });
}