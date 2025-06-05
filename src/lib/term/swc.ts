import initSwc, { transform } from "@swc/wasm-web";
import ScopedEval from "./eval";
import { vfs } from "./vfs";
import * as fmtIn from "./log";
import {
    cwd,
    defaultEnv,
    env,
    getMachineInfo,
    gid,
    groupMap,
    hostname,
    inApp,
    uid,
    userMap,
} from "./env";
import { get } from "svelte/store";
import * as permsIn from "./perms";
import * as path from "@std/path";
import * as dateFns from "date-fns";
import { ExitError } from "./err";
import * as cliHighlight from "../cli-highlight";

// Checks to entire type-safety
const fmt = fmtIn satisfies typeof import("$$/system/fmt");
const perms = permsIn satisfies typeof import("$$/system/permissions");

export const setupSwc = initSwc;

export const isScriptCommand = (file: Uint8Array) =>
    new TextDecoder().decode(file).startsWith("#!/proc/builtin swc");

export const getSystemCore = (
    argv: string[],
): typeof import("$$/system/core") => ({
    vfs,
    process: { argv },
    cwd: get(cwd),
    uid: get(uid),
    gid: get(gid),
    user: userMap[get(uid)],
    group: groupMap[get(gid)],
    machineInfo: getMachineInfo(),
    hostname: get(hostname),
    env: get(env),
    defaultEnv,
    chdir: cwd.set,
    exit,
});

export const exit = (code?: number) => {
    throw new ExitError(code);
};

export const slugify = (name: string) => name.replace(/[^A-Za-z0-9_]/gm, "_");

export const constModule = <T extends object>(name: string, module: T) =>
    Object.fromEntries(
        Object.keys(module).map((key) => [
            key,
            `__cmd_injected_${slugify(name)}_${key}`,
        ]),
    );

export const constModuleData = <T extends object>(name: string, module: T) =>
    Object.keys(module).map((key) => [
        `__cmd_injected_${slugify(name)}_${key}`,
        module[key as keyof T],
    ]);

export const getModules = (argv: string[]) => ({
    "$$/system/core": getSystemCore(argv),
    "$$/system/fmt": fmt,
    "$$/system/permissions": perms,
    "@std/path": path,
    path,
    "date-fns": dateFns,
    "cli-highlight": cliHighlight,
});

export const evalScript = async (code: string, argv: string[]) => {
    code = code.replace("#!/proc/builtin swc", "");

    const modules = getModules(argv);

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
                    globals: Object.fromEntries(
                        Object.entries(modules).map((
                            [k, v],
                        ) => [k, constModule(k, v)]),
                    ),
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

    // console.log("Eval:", out.code);

    const scope = new ScopedEval();

    inApp.set(true);

    try {
        await scope.eval(
            out.code,
            Object.assign(
                {
                    window,
                    location,
                    URL,
                    globalThis,
                    TextDecoder,
                    TextEncoder,
                },
                Object.fromEntries(
                    Object.entries(modules).flatMap(([k, v]) =>
                        constModuleData(k, v)
                    ),
                ),
            ),
        );

        get(env).set("?", "0");
    } catch (err: unknown) {
        if (err instanceof ExitError) {
            get(env).set("?", err.code.toString());
        } else {
            inApp.set(false);
            throw err;
        }
    }

    const exitCode = parseInt(get(env).get("?")!);

    get(env).set("EXIT_COLOR", exitCode == 0 ? "\x1b[32m" : "\x1b[31m");

    inApp.set(false);
};
