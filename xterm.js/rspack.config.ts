/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import * as path from "path";
import { defineConfig } from "@rspack/cli";

/**
 * This rspack config does a production build for xterm.js. It works by taking the output from tsc
 * (via `yarn watch` or `yarn prebuild`) which are put into `out/` and webpacks them into a
 * production mode umd library module in `lib/`. The aliases are used fix up the absolute paths
 * output by tsc (because of `baseUrl` and `paths` in `tsconfig.json`.
 */
export default defineConfig({
    entry: "./out/browser/public/Terminal.js",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                    },
                },
                type: "javascript/auto",
            },
        ],
    },
    resolve: {
        modules: ["./node_modules"],
        extensions: [".js"],
        alias: {
            common: path.resolve("./out/common"),
            browser: path.resolve("./out/browser"),
        },
    },
    experiments: {
        outputModule: true,
    },
    output: {
        filename: "xterm.js",
        path: path.resolve("./lib"),
        // libraryTarget: 'module',
        library: {
            type: "module",
        },
        // Force usage of globalThis instead of global / self. (This is cross-env compatible)
        globalObject: "globalThis",
    },
    mode: "production",
});
