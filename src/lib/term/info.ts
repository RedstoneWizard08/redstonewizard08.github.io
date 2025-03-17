import { writable } from "svelte/store";

export const uid = writable<number>(-1);
export const gid = writable<number>(-1);
export const cwd = writable<string>("/");
