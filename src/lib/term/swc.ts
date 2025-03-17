import initSwc, { transform } from "@swc/wasm-web";
import ScopedEval from "./eval";
import { vfs } from "./vfs";
import { println } from "./log";
import { cwd } from "./info";
import { get } from "svelte/store";
import {
    canExecute,
    canRead,
    canWrite,
    printFilePermissions,
    printPermissions,
    printTargetPermissions,
    readFilePermissions,
    readPermissions,
    writeFilePermissions,
    writePermissions,
} from "./perms";
import * as path from "@std/path";

export const setupSwc = initSwc;

export const isScriptCommand = (file: Uint8Array) =>
    new TextDecoder().decode(file).startsWith("#!/proc/builtin swc");

export const evalScript = async (code: string, argv: string[]) => {
    code = code.replace("#!/proc/builtin swc", "");

    const out = await transform(code, {
        sourceMaps: true,
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: false,
            },
            target: "es2022",
            loose: false,
            minify: {
                compress: false,
                mangle: false,
            },
            transform: {
                constModules: {
                    globals: {
                        "$$/system/core": {
                            vfs: "__cmd_injected_vfs",
                            process: "__cmd_injected_process",
                            cwd: "__cmd_injected_cwd",
                        },
                        "$$/system/fmt": {
                            println: "__cmd_injected_println",
                        },
                        "$$/system/permissions": {
                            readPermissions: "__cmd_injected_readPermissions",
                            readFilePermissions:
                                "__cmd_injected_readFilePermissions",
                            writePermissions: "__cmd_injected_writePermissions",
                            writeFilePermissions:
                                "__cmd_injected_writeFilePermissions",
                            canRead: "__cmd_injected_canRead",
                            canWrite: "__cmd_injected_canWrite",
                            canExecute: "__cmd_injected_canExecute",
                            printTargetPermissions:
                                "__cmd_injected_printTargetPermissions",
                            printFilePermissions:
                                "__cmd_injected_printFilePermissions",
                            printPermissions: "__cmd_injected_printPermissions",
                        },
                        "@std/path": Object.fromEntries(
                            Object.keys(path).map((key) => [
                                key,
                                `__cmd_injected_std_path_${key}`,
                            ])
                        ),
                        path: Object.fromEntries(
                            Object.keys(path).map((key) => [
                                key,
                                `__cmd_injected_std_path_${key}`,
                            ])
                        ),
                    },
                },
            },
        },
        module: {
            type: "es6",
        },
        minify: false,
        isModule: true,
        sourceFileName: "script.ts",
    });

    const scope = new ScopedEval();

    await scope.eval(
        out.code,
        Object.assign(
            {
                __cmd_injected_vfs: vfs,
                __cmd_injected_cwd: get(cwd),
                __cmd_injected_println: println,
                __cmd_injected_readPermissions: readPermissions,
                __cmd_injected_readFilePermissions: readFilePermissions,
                __cmd_injected_writePermissions: writePermissions,
                __cmd_injected_writeFilePermissions: writeFilePermissions,
                __cmd_injected_canRead: canRead,
                __cmd_injected_canWrite: canWrite,
                __cmd_injected_canExecute: canExecute,
                __cmd_injected_printTargetPermissions: printTargetPermissions,
                __cmd_injected_printFilePermissions: printFilePermissions,
                __cmd_injected_printPermissions: printPermissions,
                __cmd_injected_process: {
                    argv,
                },
            },
            Object.fromEntries(
                Object.keys(path).map((key) => [
                    `__cmd_injected_std_path_${key}`,
                    path[key as keyof typeof path],
                ])
            )
        )
    );
};
