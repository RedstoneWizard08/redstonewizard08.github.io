import { parseScript, type Options } from "meriyah";
import type { Program } from "estree";

const paserOptions: Options = {
    next: true,
    ranges: true,
    loc: true,
    webcompat: true,
    globalReturn: true,
    impliedStrict: true,
};

export default function (code: string): Program {
    return parseScript(code, paserOptions) as Program;
}
