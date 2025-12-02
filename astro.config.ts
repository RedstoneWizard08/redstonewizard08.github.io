import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import uno from "unocss/astro";
import svelte from "@astrojs/svelte";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    prefetch: true,

    integrations: [
        mdx(),
        sitemap(),
        icon(),
        partytown(),
        robotsTxt(),
        compress(),
        svelte(),

        uno({
            injectReset: true,
        }),
    ],

    vite: {
        plugins: [wasm()],

        server: Object.keys(process.env).includes("REDSTONE_IS_DUMB") ? {
            headers: {
                "Cross-Origin-Opener-Policy": "same-origin",
                "Cross-Origin-Embedder-Policy": "require-corp",
            },

            hmr: {
                port: 4000,
                clientPort: 443,
                protocol: "wss",
            },

            port: 4000,
            strictPort: true,
        } : {},

        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                },
            },
        },

        optimizeDeps: {
            exclude: [
                "@swc/wasm-web",
                "@wasmer/sdk",
            ],
        },
    },

    server: {
        port: 4000,

        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },

    site: "https://redstonewizard08.github.io",
});
