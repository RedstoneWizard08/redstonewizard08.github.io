#!/proc/builtin swc

import { formatDate } from "date-fns";
import { println } from "$$/system/fmt";

const width = 63;

// From https://github.com/chalk/ansi-regex/blob/main/index.js (MIT License, as of 2025-05-09)
const ansiRegex = () => {
    const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";

    const pattern = [
        `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|");

    return new RegExp(pattern, "g");
};

const mul = (s: string, n: number) => Array(n).fill(s).join("");
const stripAnsi = (s: string) => s.replace(ansiRegex(), "");

const center = (lhs: string, rhs: string) =>
    `${lhs}${mul(" ", Math.floor(Math.max(0, width - (stripAnsi(lhs).length + stripAnsi(rhs).length))))}${rhs}`;

println(mul("=", width));
println();
println(
    center("System Resources", `\x1b[38;5;129m${new Date().toUTCString()}\x1b[0m`)
);
println();

const categories = [
    {
        name: "known languages",
        count: 300,
        color: 165,
        updated: new Date(),
    },
    {
        name: "used technologies",
        count: 300,
        color: 39,
        updated: new Date(),
    },
    {
        name: "blog posts",
        count: 300,
        color: 214,
        updated: new Date(),
    },
];

for (const item of categories) {
    println(center(
        `\x1b[92m${item.count}\x1b[0m\x1b[38;5;${item.color}m ${item.name}\x1b[0m`,
        `\x1b[37mlast updated ${formatDate(item.updated, "yyyy-MM-dd")}\x1b[0m`,
    ));
}

println();
println(mul("=", width));
