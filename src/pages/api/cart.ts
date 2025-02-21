import type { APIRoute } from "astro";

import { cart } from '../../lib/cart';

// add
export const POST: APIRoute = async ({ request }) => {    
    const form = await request.json();

    let result;

    try {
        result = await cart.add(form.cid, form.item);
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            error: (err as Error).message
        }), { status: 400 });
    }

    return new Response(JSON.stringify(result), { status: 201 });
}