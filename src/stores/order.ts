import { atom } from 'nanostores';

export const isComplete = atom<boolean>(false);

export function toggleCompletion (isSuccessful: boolean) {
    isComplete.set(isSuccessful);
}