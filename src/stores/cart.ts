import { persistentAtom, setPersistentEngine } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { CartItem } from '../lib/constants';
import { getProductQuantity } from './inventory';

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
    });
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

    const updatedQuantity = (itemFound ? itemFound.quantity : 0) + item.quantity;

    if (updatedQuantity > getProductQuantity(item.slug)) {
        return false;
    }
    
    newCart[item.slug] = Object.assign({}, itemFound || item, {
        quantity: updatedQuantity
    });

    cartItems.set(Object.assign({}, cartItems.get(), newCart));
    return true;
}

export function updateCartQuantity (item: CartItem, quantity: number) {
    let newCart: Cart = {};
    const itemFound = cartItems.get()[item.slug];

    if (!itemFound) {
        throw new Error('Cart item is missing');
    }

    if (itemFound.quantity <= 1 && quantity === -1) {
        const { [itemFound.slug]: rmKey, ...partialObj } = cartItems.get();
        cartItems.set(partialObj);
        return;
    }
    
    newCart[item.slug] = Object.assign({}, itemFound, {
        quantity: itemFound.quantity + quantity
    });

    cartItems.set(Object.assign({}, cartItems.get(), newCart));
}

export function empty () {
    cartItems.set({});
}