import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetWebFonts,
    presetWind4,
    transformerDirectives,
} from "unocss";

export default defineConfig({
    presets: [
        presetAttributify(),
        presetWind4(),
        presetIcons(),
        presetTypography(),
        presetWebFonts(),
    ],

    transformers: [
        transformerDirectives(),
    ],
});
