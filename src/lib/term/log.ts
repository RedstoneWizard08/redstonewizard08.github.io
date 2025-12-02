import { get } from "svelte/store";
import { terminal } from "./terminal";
import { env } from "./env";
import { inOrElse } from "./util";

const logLevels = ["debug", "info", "warn", "error", "none"] as const;

const logLevel = () =>
    inOrElse(env.get("LOG_LEVEL")?.toLowerCase(), logLevels, "none");

const canLog = (level: ReturnType<typeof logLevel>) =>
    logLevels.indexOf(level) >= logLevels.indexOf(logLevel());

const ifLog = (level: ReturnType<typeof logLevel>, call: () => void) => {
    if (canLog(level)) call();
};

export const clearScreen = () => get(terminal).clear();
export const println = (data: string = "") => get(terminal).writeln(data);

export const logInfo = (data: string = "") =>
    ifLog("info", () =>
        get(terminal).writeln(`\x1b[1;96m[INFO]\x1b[0;36m ${data}\x1b[0m`)
    );

export const logWarn = (data: string = "") =>
    ifLog("warn", () =>
        get(terminal).writeln(`\x1b[1;93m[WARN]\x1b[0;33m ${data}\x1b[0m`)
    );

export const logError = (data: string = "") =>
    ifLog("error", () =>
        get(terminal).writeln(`\x1b[1;91m[ERROR]\x1b[0;31m ${data}\x1b[0m`)
    );

export const logDebug = (data: string = "") =>
    ifLog("debug", () =>
        get(terminal).writeln(
            `\x1b[38;5;248m[DEBUG]\x1b[38;5;245m ${data}\x1b[0m`
        )
    );
