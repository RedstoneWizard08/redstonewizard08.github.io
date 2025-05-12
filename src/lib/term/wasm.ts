import type { Instance } from "@wasmer/sdk";
import { Wasmer } from "@wasmer/sdk";
import { terminal } from "./terminal.ts";
import { get } from "svelte/store";

export const getWasm = () => Wasmer;

export const connectStreams = (instance: Instance) => {
    const term = get(terminal);
    const encoder = new TextEncoder();
    const stdin = instance.stdin?.getWriter();

    const inStream = term.onData((data) => stdin?.write(encoder.encode(data)));
    
    const outStream = new WritableStream({
        write: (chunk) => term.write(chunk),
    });

    const errStream = new WritableStream({
        write: (chunk) => term.write(chunk),
    });

    instance.stdout.pipeTo(outStream);
    instance.stderr.pipeTo(errStream);

    return () => {
        inStream.dispose();
    };
};
