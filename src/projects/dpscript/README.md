# DPScript

## Overview

DPScript is a programming language for Minecraft datapacks that aims to simplify
their development. It features a Rust-like syntax with full type checking,
useful errors, and a completely custom tokenizer, lexer, and analyzer, as well
as type inference and compile-time optimization. Its compiler is extremely fast
and easy to set up and use, and has a full standard library for many complex
operations.

## Downloads

Right now it is not open-source, as it is still under development, however it
will be made open-source in the near future, once it is complete.

## Authorship

The entire compiler to date is written by me, which minor contributions from
KodeurKubik, however he is aiming to contribute more in the future. At this
point we are both working on this.

The compiler is written in Rust by hand, and features fully custom
implementations of a tokenizer, lexer, and other core components.

## Future Plans

Future plans for DPScript include a full-blown language server, for
autocomplete, semantic tokens/highlighting, error checking in-IDE, and many
other nice features. A package manager and registry is also planned.

## Example

<details>
<summary>Expand</summary>

```dps
import std::gm::sqrt::sqrt;
import std::selectors::tellraw;
import std::selectors::all_players;
import std::math::add;

// This is a basic function:
pub fn say_hi() {
    // `const` means this is just something that gets substituted for the real value during compilation.
    // The `&` just adds those properties to the component.
    // The `component: ""` syntax can be shortened to `c: ""`.
    const base: NBT = component: "Hello, " + nbt: { color: "green" };

    // this is syntactic sugar - this is really: new array, push(...), push(...)
    let text = [base, selector: "@s" + nbt: { color: "red" }, component: "!"];

    // declare a selector
    const self: Selector = selector: "@s";

    // tell them something!
    self.tellraw(text);
}

// Every module can have one or more init blocks, which will be their own functions and added to the load tag.
init {
    const txt: NBT = component: "Hello, world!" + nbt: { color: "green" };
    let data = sqrt(100);
    
    const base: NBT = component: "The square root of 100 is: ";
    let msg = [base, data];

    all_players.tellraw([txt]);
    all_players.tellraw(msg);

    const calc_base: NBT = component: "1 + 2 is: ";
    let calc_msg = [base, 1 + 2];

    all_players.tellraw(calc_msg);

    // execute as @a run ...
    for player in all_players {
        say_hi();
    }
}

// Every module can also have one or more tick blocks, which will be their own functions and added to the tick tag.
tick {
    // idk, do something here.
}
```

</details>
