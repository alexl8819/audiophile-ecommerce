import { persistentAtom, setPersistentEngine } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { CartItem } from '../lib/constants';

export interface Cart {
    [slug: string]: CartItem
}

// Switch from localStorage to sessionStorage
if (typeof window !== 'undefined') {
    let listeners: Array<any> = [];

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
        }
    );
}

export const isOpen = atom<boolean>(false);

export const cartItems = persistentAtom<Cart>('cart', {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function toggleCart () {
    isOpen.set(isOpen.get() ? false : true);
}

export function addCartItem (item: CartItem) {
    const newCart: Cart = {};
    const itemFound = cartItems.get()[item.slug];
    
    newCart[item.slug] = Object.assign({}, itemFound || item, {
        quantity: (itemFound ? itemFound.quantity : 0) + item.quantity
    });

    cartItems.set(Object.assign({}, cartItems.get(), newCart));
}

export function empty () {
    cartItems.set({});
}