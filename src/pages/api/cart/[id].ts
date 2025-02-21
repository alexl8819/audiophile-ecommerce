import { type APIRoute } from "astro";

import { cart } from '../../../lib/cart';

export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({
            error: 'cart id must be provided'
        }), { status: 400 });
    }

    const items = await cart.getAll(id);

    return new Response(JSON.stringify({
        items
    }), { status: 200 });
}

export const PATCH: APIRoute = async ({ request, params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({
            error: 'cart id must be provided'
        }), { status: 400 });
    }

    const form = await request.json();
    const item = form['item'];

    if (!item) {
        return new Response(JSON.stringify({
            error: ''
        }), { status: 400 });
    }

    try {
        await cart.update(id, item);
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            error: (err as Error).message
        }), { status: 500 });
    }

    return new Response(null, { status: 200 });
}

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({
            error: 'cart id must be provided'
        }), { status: 400 });
    }
    
    await cart.clear(id);

    return new Response(null, { status: 204 });
}