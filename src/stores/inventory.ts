import { persistentAtom } from '@nanostores/persistent';

interface LiveInventory {
    [slug: string]: number 
}

export const currentInventory = persistentAtom<LiveInventory>('inventory', {}, {
    encode: JSON.stringify,
    decode: JSON.parse
});

export function addProductToInventory (slug: string, quantityAvailable: number) {
    const newInventory: LiveInventory = {};
    const existingInventory = currentInventory.get()[slug];

    if (!existingInventory) {
        newInventory[slug] = quantityAvailable;
    }

    currentInventory.set(Object.assign({}, currentInventory.get(), newInventory));
}

export function getProductQuantity (slug: string) {
    const existingInventory = currentInventory.get()[slug];

    if (!existingInventory) {
        throw new Error('Product not found');
    }

    return existingInventory;
}