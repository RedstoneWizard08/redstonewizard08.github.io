import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const blog = defineCollection({
    loader: glob({ pattern: "**/*.(md|mdx)", base: "./src/blog" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        date: z.date(),
    }),
});

export const collections = { blog };