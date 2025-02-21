import { persistentAtom, setPersistentEngine, type PersistentListener } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { Cart, CartItemRequest } from '../lib/constants';
import { createMutatorStore } from './fetcher';

export interface CartRef {
    id: string | null,
    items: Cart
}

// Switch from localStorage to sessionStorage
if (typeof window !== 'undefined') {
    let listeners: Array<PersistentListener> = [];

    setPersistentEngine(window.sessionStorage, {
        addEventListener (_, callback) {
            listeners.push(callback)
        },
        removeEventListener (_, callback) {
            listeners = listeners.filter(i => i !== callback)
        },
        // window dispatches "storage" events for any key change
        // => One listener for all map keys is enough
        perKey: false
    });
}

export const isOpen = atom<boolean>(false);

export const cartRef = persistentAtom<CartRef>('cart', { id: null, items: {} }, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function toggleCart () {
    isOpen.set(isOpen.get() ? false : true);
}

interface CartAPIRequest {
    key: string | null,
    item?: CartItemRequest
}

export function saveCart (id: string, items: Cart = {}) {
    cartRef.set({ id, items });
}


export const getCartItems = createMutatorStore<CartAPIRequest>(
    async ({ data: r, revalidate }) => {
        revalidate(`/api/carts/${r.key}`);
        return fetch(`/api/cart/${r.key}`);
    }
);

export const addToCart = createMutatorStore<CartAPIRequest>(
    async ({ data: r, revalidate, getCacheUpdater }) => {
        return fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({
                cid: r.key,
                item: r.item
            })
        });
    }
);

export const updateCartQuantity = createMutatorStore<CartAPIRequest>(
    async ({ data: r, revalidate }) => {
        revalidate(`/api/cart/${r.key}`);
        return fetch(`/api/cart/${r.key}`, {
            method: 'PATCH',
            body: JSON.stringify({
                item: r.item
            })
        });
    }
);


export const emptyCart = createMutatorStore<CartAPIRequest>(
    async ({ data: r, getCacheUpdater }) => {
        const [updateCache, _] = getCacheUpdater(`/api/post/${r.key}`);
        updateCache({});
        return fetch(`/api/cart/${r.key}`, {
            method: 'DELETE'
        });
    }
);