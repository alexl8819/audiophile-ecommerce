import { atom } from 'nanostores';

export const isComplete = atom<boolean>(false);

export const shippingCost = atom<number>(0);

export const vatRate = atom<number>(0);

export function toggleCompletion (isSuccessful: boolean) {
    isComplete.set(isSuccessful);
}

export function applyShipping (shippingFee: number) {
    shippingCost.set(shippingFee);
}

export function applyVatRate (rate: number) {
    vatRate.set(rate);
}