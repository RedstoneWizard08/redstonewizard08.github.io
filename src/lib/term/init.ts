import initSwc from "@swc/wasm-web";
import { terminal } from "./terminal";
import { get } from "svelte/store";
import { termPrompt } from "../stores";
import { generateFilesystem } from "./gen";
import { println } from "./log";
import { runCommand } from "./exec";

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
    // I don't know if I like this.
    // logInitPre("Spawning process /usr/bin/help...");
    // println();
    // await runCommand("help");
    // println();
    // logInit("Spawned process /usr/bin/help.");
    logInit("Booted WebOS.");
    println();

    get(terminal).write(get(termPrompt));
};
