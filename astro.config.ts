import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import uno from "unocss/astro";
import svelte from "@astrojs/svelte";

export default defineConfig({
    // site: "https://example.com",
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
    },

    server: {
        port: 4000,
        // allowedHosts: true,
    },
});
