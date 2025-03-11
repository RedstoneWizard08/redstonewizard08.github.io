import {
    defineConfig,
    presetAttributify,
    presetWind4,
    presetIcons,
    presetTypography,
    presetWebFonts,
} from "unocss";

export default defineConfig({
    presets: [
        presetAttributify(),
        presetWind4(),
        presetIcons(),
        presetTypography(),
        presetWebFonts(),
    ],
});
