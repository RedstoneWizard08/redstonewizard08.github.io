import { get } from "svelte/store";
import { terminal } from "./terminal";

export const println = (data: string = "") => {
    get(terminal).writeln(data);
};

export const logInfo = (data: string = "") => {
    get(terminal).writeln(
        `\x1b[1;96m[\x1b[0;36mINFO\x1b[1;96m]\x1b[0;36m ${data}\x1b[0m`
    );
};

export const logWarn = (data: string = "") => {
    get(terminal).writeln(
        `\x1b[1;93m[\x1b[0;33mWARN\x1b[1;93m]\x1b[0;33m ${data}\x1b[0m`
    );
};

export const logError = (data: string = "") => {
    get(terminal).writeln(
        `\x1b[1;91m[\x1b[0;31mERROR\x1b[1;91m]\x1b[0;31m ${data}\x1b[0m`
    );
};
