import adapterAuto from "@sveltejs/adapter-auto";
import adapterNode from "@sveltejs/adapter-node";
import adapterStatic from "@sveltejs/adapter-static";

import importAssets from "svelte-preprocess-import-assets";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess(), importAssets()],

    kit: {
        adapter: process.env.SVELTE_ADAPTER
            ? process.env.SVELTE_ADAPTER.toLowerCase() == "node"
                ? adapterNode()
                : process.env.SVELTE_ADAPTER.toLowerCase() == "static"
                ? adapterStatic()
                : adapterAuto()
            : adapterAuto(),
    },
};

export default config;
