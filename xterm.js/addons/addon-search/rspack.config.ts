/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import * as path from "path";
import { defineConfig } from "@rspack/cli";

const addonName = "SearchAddon";
const mainFile = "addon-search.js";

export default defineConfig({
    entry: `./out/${addonName}.js`,
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: ["./node_modules"],
        extensions: [".js"],
        alias: {
            common: path.resolve("../../out/common"),
        },
    },
    experiments: {
        outputModule: true,
    },
    output: {
        filename: mainFile,
        path: path.resolve("./lib"),
        // library: addonName,
        // libraryTarget: 'module',
        library: {
            type: "module",
        },
    },
    mode: "production",
});
