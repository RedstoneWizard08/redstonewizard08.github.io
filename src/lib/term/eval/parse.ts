import { parseScript, type Options } from "meriyah";
import * as ESTree from "espree";

const paserOptions: Options = {
    next: true,
    ranges: true,
    loc: true,
    webcompat: true,
    globalReturn: true,
    impliedStrict: true,
};

export default function (code: string): ESTree.Program {
    return parseScript(code, paserOptions) as ESTree.Program;
}
