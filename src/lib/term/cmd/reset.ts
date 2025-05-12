#!/proc/builtin swc

import { chdir, defaultEnv, env, vfs } from "$$/system/core";
import { clearScreen } from "$$/system/fmt";

vfs.reset();
env.clear();
Object.entries(defaultEnv).forEach(([k, v]) => env.set(k, v));
chdir("/");
clearScreen();
