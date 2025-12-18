import { marked } from "marked";
import { createHighlighter, createOnigurumaEngine } from "shiki";
import { createHighlighterCore } from "shiki/core";
import md from "@shikijs/langs/md";
import js from "@shikijs/langs/js";
import rs from "@shikijs/langs/rs";
import ts from "@shikijs/langs/ts";
import kt from "@shikijs/langs/kt";
import githubDarkDimmed from "@shikijs/themes/github-dark-dimmed";
import markedShiki from "marked-shiki";
import dps from "./shiki/dpscript.tmLanguage.json" with { type: "json" };
import footnotes from "marked-footnote";
import { shikiTransformers } from "./shiki-config.js";

export const highlighterPub = await createHighlighterCore({
    langs: [md, js, rs, ts, kt, dps],
    langAlias: {
        dpscript: "DPScript",
        dps: "dpscript",
    },
    themes: [githubDarkDimmed],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
});

export const highlighter = await createHighlighter({
    langs: ["md", "js", "rs", "ts", "kt", dps],
    langAlias: {
        dpscript: "DPScript",
        dps: "dpscript",
    },
    themes: ["github-dark-dimmed"],
});

marked.use(
    {
        gfm: true,
    },
    footnotes(),
    markedShiki({
        highlight: (code, lang, props) =>
            highlighter.codeToHtml(
                code,
                {
                    lang,
                    theme: "github-dark-dimmed",
                    meta: { __raw: props.join(" ") },
                    transformers: shikiTransformers(),
                },
            ),
    }),
);

export default marked;
