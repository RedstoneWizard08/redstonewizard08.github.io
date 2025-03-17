#!/bin/bash

cd xterm.js

bun run build
bun run package

addons=(fit search web-links webgl)

for addon in "${addons[@]}"; do
    cd addons/addon-$addon
    bun run package
    cd ../..
done

cd ..
