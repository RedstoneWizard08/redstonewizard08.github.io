#!/proc/builtin swc

import { println } from "$$/system/fmt";

const main = async () => {
    println(await (await fetch("/")).text());
};

await main();
