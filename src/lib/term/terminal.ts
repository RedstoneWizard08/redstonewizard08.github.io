import type { Terminal } from "@xterm/xterm";
import { writable } from "svelte/store";

export const terminal = writable<Terminal>();
