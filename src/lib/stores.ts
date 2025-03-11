import { writable } from "svelte/store";

/**
 * The terminal buffer.
 */
export const termBuffer = writable<string>("");

/**
 * The position of the cursor. This must be the number of
 * characters from the END of the buffer.
 */
export const termCursorPosition = writable<number>(0);
export const termContent = writable<string>("");
export const termPrompt = writable<string>("$&nbsp;");
export const termClipboardPermission = writable<boolean>(false);
export const termHistory = writable<string[]>([]);
