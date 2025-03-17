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

        server: {
            hmr: {
                port: 4000,
                clientPort: 443,
                protocol: "wss",
            },

            port: 4000,
            strictPort: true,
        },

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
            ],
        },
    },

    server: {
        port: 4000,
    },

    site: "https://redstonewizard08.github.io",
});
