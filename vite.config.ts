import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
    plugins: [imagetools(), sveltekit()],

    server: {
        port: 4000,

        hmr: {
            port: 4000,
            clientPort: 443,
            protocol: "wss",
        },
    },
});
