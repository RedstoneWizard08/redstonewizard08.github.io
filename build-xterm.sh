#!/bin/bash

cd xterm.js

bun i
bun run rspack

addons=(fit search web-links webgl)

for addon in "${addons[@]}"; do
    cd addons/addon-$addon
    bun i
    bun run rspack
    cd ../..
done

cd ..
