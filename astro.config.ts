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
import projectsLoader from "./plugins/projects.ts";
import { shikiTransformers } from "./src/lib/shiki-config.ts";
import { remarkCallout } from "@r4ai/remark-callout";
import rehypeExternalLinks from "rehype-external-links";
import playformCompress from "@playform/compress";

// @ts-expect-error - Just making TS shut up about the default export.
wasm.default ??= wasm;

export default defineConfig({
    prefetch: true,
    compressHTML: true,

    integrations: [
        projectsLoader(),
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

        playformCompress(),
    ],

    vite: {
        plugins: [wasm.default()],

        build: {
            minify: "terser",
        },

        server: Object.keys(import.meta.env).includes("REDSTONE_IS_DUMB")
            ? {
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
            }
            : {},

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
    },

    markdown: {
        remarkPlugins: [remarkCallout],

        rehypePlugins: [[rehypeExternalLinks, {
            target: "_blank",
        }]],

        shikiConfig: {
            transformers: shikiTransformers(),
        },
    },

    site: "https://redstonewizard08.github.io",
});
