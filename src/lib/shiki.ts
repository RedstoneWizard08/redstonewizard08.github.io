import { createOnigurumaEngine } from "shiki";
import { createHighlighterCore } from "shiki/core";
import md from "@shikijs/langs/md";
import js from "@shikijs/langs/js";
import rs from "@shikijs/langs/rs";
import ts from "@shikijs/langs/ts";
import kt from "@shikijs/langs/kt";
import py from "@shikijs/langs/py";
import java from "@shikijs/langs/java";
import githubDarkDimmed from "@shikijs/themes/github-dark-dimmed";
import dps from "./shiki/dpscript.tmLanguage.json" with { type: "json" };
import ron from "./shiki/ron.tmLanguage.json" with { type: "json" };
import bf from "./shiki/bf.tmLanguage.json" with { type: "json" };

export const highlighterPub = await createHighlighterCore({
    langs: [md, js, rs, ts, kt, py, java, ron as any, bf, dps],
    langAlias: {
        dpscript: "DPScript",
        dps: "dpscript",
        ron: "Rusty Object Notation",
        bf: "BrainFuck",
    },
    themes: [githubDarkDimmed],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
});
