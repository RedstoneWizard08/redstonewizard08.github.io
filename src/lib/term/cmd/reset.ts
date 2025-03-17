#!/proc/builtin swc

import { chdir, vfs } from "$$/system/core";
import { clearScreen } from "$$/system/fmt";

vfs.reset();
chdir("/");
clearScreen();
