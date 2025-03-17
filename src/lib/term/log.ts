import { get } from "svelte/store";
import { terminal } from "./terminal";

export const clearScreen = () => {
    get(terminal).clear();
};

export const println = (data: string = "") => {
    get(terminal).writeln(data);
};

export const logInfo = (data: string = "") => {
    get(terminal).writeln(`\x1b[1;96m[INFO]\x1b[0;36m ${data}\x1b[0m`);
};

export const logWarn = (data: string = "") => {
    get(terminal).writeln(`\x1b[1;93m[WARN]\x1b[0;33m ${data}\x1b[0m`);
};

export const logError = (data: string = "") => {
    get(terminal).writeln(`\x1b[1;91m[ERROR]\x1b[0;31m ${data}\x1b[0m`);
};
