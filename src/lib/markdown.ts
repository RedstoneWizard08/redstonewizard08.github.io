import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import gdd from "@shikijs/themes/github-dark-default";
import { shikiTransformers } from "./shiki-config.ts";
import { highlighterPub } from "./shiki.ts";
import rehypeExternalLinks from "rehype-external-links";

export const renderer = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
        allowDangerousHtml: true,
        passThrough: [],
    })
    .use(rehypeExternalLinks, {
        target: "_blank",
    })
    // @ts-expect-error It's ok, the types are correct.
    .use(rehypeShikiFromHighlighter, highlighterPub, {
        transformers: shikiTransformers(),
        theme: gdd,
    })
    .use(rehypeRaw)
    .use(rehypeStringify, {
        allowDangerousHtml: true,
    });
