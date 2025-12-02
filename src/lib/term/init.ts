import initSwc from "@swc/wasm-web";
import { terminal } from "./terminal";
import { get } from "svelte/store";
import { termPrompt } from "../stores";
import { generateFilesystem } from "./gen";
import { println } from "./log";
import { runCommand } from "./exec";
import { setDefaultEnv } from "./env.ts";

export const logInitPre = (msg: string) => {
    println(`\x1b[0m       ${msg}`);
};

export const logInit = (msg: string) => {
    println(`\x1b[0m[ \x1b[92mOK\x1b[0m ] ${msg}`);
};

export const initTerminal = async () => {
    logInitPre("Booting WebOS...");
    logInit("Bootstrapped virtual filesystem.");
    logInitPre("Starting Speedy Web Compiler service...");

    await initSwc();

    logInit("Started Speedy Web Compiler service.");
    logInitPre("Generating filesystem...");

    await generateFilesystem();

    logInit("Generated filesystem.");
    logInitPre("Setting environment...");

    setDefaultEnv();

    logInit("Environment set.");
    logInitPre("Loading persistent data...");

    logInit("Loaded persistent data.");
    logInitPre("Spawning process /usr/bin/help...");

    println();

    await runCommand("help");

    println();

    logInit("Spawned process /usr/bin/help.");
    logInit("Running final system processes...");
    logInit("Booted WebOS.");

    println();

    get(terminal).write(termPrompt());
};
