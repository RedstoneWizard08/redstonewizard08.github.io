#!/proc/builtin swc

import { exit, process } from "$$/system/core";
import { connectStreams, getWasm } from "$$/system/wasm";
import { logError, logInfo } from "$$/system/fmt";

process.argv.shift(); // remove the command

const main = async () => {
    const wasm = getWasm();
    const pkgId = process.argv.shift();

    if (!pkgId) {
        logError("Usage: wasmer [pkg]");
        exit(1);
    }

    logInfo(`Fetching: ${pkgId}`);

    const pkg = await wasm.fromRegistry(pkgId);

    logInfo(`Starting: ${pkgId}`);

    const inst = await pkg.entrypoint.run();
    const close = connectStreams(inst);

    try {
        await inst.wait();
    } catch (_err: unknown) {
        // ignore
    }

    inst.free();
    close();
};

main();
