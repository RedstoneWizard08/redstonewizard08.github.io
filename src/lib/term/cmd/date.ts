#!/proc/builtin swc

import { println } from "$$/system/fmt";

println(
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
    }).format(Date.now())
);
