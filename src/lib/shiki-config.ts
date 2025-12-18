import type { ShikiTransformer } from "shiki";
import {
    transformerMetaHighlight,
    transformerMetaWordHighlight,
    transformerNotationDiff,
    transformerNotationErrorLevel,
    transformerNotationFocus,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
} from "@shikijs/transformers";

export const shikiTransformers = (): ShikiTransformer[] => [
    transformerNotationDiff({
        matchAlgorithm: "v3",
    }),
    transformerNotationHighlight({
        matchAlgorithm: "v3",
    }),
    transformerNotationWordHighlight({
        matchAlgorithm: "v3",
    }),
    transformerNotationFocus({
        matchAlgorithm: "v3",
    }),
    transformerNotationErrorLevel({
        matchAlgorithm: "v3",
    }),
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
];
