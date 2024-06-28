import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    
    devServer: {
        port: 4000,
    },

    css: [
        "@fortawesome/fontawesome-free/css/all.min.css",
        "@fontsource/ubuntu/index.css",
    ],

    build: {
        transpile: ["vuetify"],
    },

    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
    ],
    
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },

        server: {
            hmr: {
                port: 4000,
                clientPort: 443,
                protocol: "wss",
            },
        },
    },

    typescript: {
        typeCheck: true,
    },

    devtools: { enabled: true },
});
