import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkCallout from "@r4ai/remark-callout";
import remarkReadingTime from "remark-reading-time";
import { unified } from "unified";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import gdd from "@shikijs/themes/github-dark-default";
import { shikiTransformers } from "./shiki-config.ts";
import { highlighterPub } from "./shiki.ts";
import rehypeExternalLinks from "rehype-external-links";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { Root } from "mdast";
import type { Position } from "unist";

export interface Heading {
    depth: number;
    text: string;
    link: string;
    position?: Position;
}

export const getHeadings = () => {
    return (tree: Root, file: VFile) => {
        const headings: Heading[] = [];
        let idx = 0;

        visit(tree, "heading", (n) => {
            const id = `heading-${idx}`;

            n.data ??= {};
            n.data.hProperties ??= {};
            n.data.hProperties.id = id;

            const txt = n.children
                .map((c) => (c.type == "text" ? c.value : ""))
                .join("");

            idx += 1;

            headings.push({
                depth: n.depth,
                text: txt,
                position: n.position,
                link: id,
            });
        });

        file.data.headings = headings;
    };
};

export const renderer = unified()
    .use(remarkParse)
    .use(remarkCallout)
    .use(remarkGfm)
    .use(getHeadings)
    .use(remarkReadingTime, { attribute: "readingTime" } as any)
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
