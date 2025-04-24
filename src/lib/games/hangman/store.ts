// src/lib/games/hangman/store.ts
import { writable } from 'svelte/store';

export const guessed = writable<string[]>([]);
export const hintUsed = writable(false);
export const selectedCategory = writable<keyof typeof import('./words').categories | null>(null);
export const currentWord = writable<string>('');
