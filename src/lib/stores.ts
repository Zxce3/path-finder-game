import { writable } from 'svelte/store';

export const timer = writable(0);
export const isPaused = writable(false);
export const highScore = writable(0);
export const score = writable(0);
export const level = writable(1);
export const timeLimit = writable(30); // 30 seconds time limit
