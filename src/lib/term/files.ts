// @ts-nocheck For some reason it doesn't recognize ?raw.

import ls from "./cmd/ls.ts?raw";
import cat from "./cmd/cat.ts?raw";
import cd from "./cmd/cd.ts?raw";
import pwd from "./cmd/pwd.ts?raw";
import rm from "./cmd/rm.ts?raw";
import touch from "./cmd/touch.ts?raw";
import clear from "./cmd/clear.ts?raw";
import reset from "./cmd/reset.ts?raw";
import id from "./cmd/id.ts?raw";
import whoami from "./cmd/whoami.ts?raw";
import echo from "./cmd/echo.ts?raw";
import date from "./cmd/date.ts?raw";
import uname from "./cmd/uname.ts?raw";
import hostname from "./cmd/hostname.ts?raw";
import help from "./cmd/help.ts?raw";
import rsh from "./cmd/rsh.ts?raw";
import sysinfo from "./cmd/sysinfo.ts?raw";
import exportCmd from "./cmd/export.ts?raw";
import exit from "./cmd/exit.ts?raw";
import unset from "./cmd/unset.ts?raw";

const modules = {
    ls,
    cat,
    cd,
    pwd,
    rm,
    touch,
    clear,
    reset,
    id,
    whoami,
    echo,
    date,
    uname,
    hostname,
    help,
    rsh,
    sysinfo,
    exportCmd,
    exit,
    unset,
};

const modulesTyped = modules as Record<keyof typeof modules, string>;

export { modulesTyped as modules };
