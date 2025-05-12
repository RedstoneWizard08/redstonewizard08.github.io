import type { Theme } from "../../cli-highlight/theme";

declare module "cli-highlight" {
    /**
     * Options passed to [[highlight]]
     */
    interface HighlightOptions {
        /**
         * Can be a name, file extension, alias etc. If omitted, tries to auto-detect language.
         */
        language?: string;

        /**
         * When present and evaluates to a true value, forces highlighting to finish even in case of
         * detecting illegal syntax for the language instead of throwing an exception.
         */
        ignoreIllegals?: boolean;

        /**
         * Optional array of language names and aliases restricting detection to only those languages.
         */
        languageSubset?: string[];

        /**
         * Supply a custom theme where you override language tokens with own formatter functions. Every
         * token that is not overriden falls back to the [[DEFAULT_THEME]]
         */
        theme?: Theme;
    }

    /**
     * Apply syntax highlighting to `code` with ASCII color codes. The language is automatically
     * detected if not set.
     *
     * ```ts
     * import {highlight} from 'cli-highlight';
     * import * as fs from 'fs';
     *
     * fs.readFile('package.json', 'utf8', (err: any, json: string) => {
     *     console.log('package.json:');
     *     console.log(highlight(json));
     * });
     * ```
     *
     * @param code The code to highlight
     * @param options Optional options
     */
    function highlight(
        code: string,
        options?: HighlightOptions,
    ): string;
}
