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

export type DefaultFiles<K, V> = readonly [...[K, V][]];

export const defaultDirs: [string, number][] = [
    ["/usr", 0o755],
    ["/usr/bin", 0o755],
    ["/usr/lib", 0o755],
    ["/usr/local", 0o755],
    ["/usr/local/bin", 0o755],
    ["/usr/local/lib", 0o755],
    ["/etc", 0o755],
    ["/var", 0o755],
    ["/var/lib", 0o755],
    ["/home", 0o755],
];

export const defaultFiles: DefaultFiles<string, string> = [
    ["/usr/bin/echo", echo],
    ["/usr/bin/ls", ls],
    ["/usr/bin/cat", cat],
    // ["/usr/bin/rsh", rsh],
    // ["/usr/bin/mkdir", mkdir],
    ["/usr/bin/rm", rm],
    ["/usr/bin/touch", touch],
    // ["/usr/bin/ed", ed],
    ["/usr/bin/cd", cd],
    // ["/usr/bin/cp", cp],
    ["/usr/bin/help", help],
    ["/usr/bin/whoami", whoami],
    ["/usr/bin/hostname", hostname],
    ["/usr/bin/uname", uname],
    ["/usr/bin/date", date],
    // ["/usr/bin/mv", mv],
    ["/usr/bin/pwd", pwd],
    // ["/usr/bin/rmdir", rmdir],
    ["/usr/bin/clear", clear],
    // ["/usr/bin/ln", ln],
    ["/usr/bin/id", id],
    ["/usr/bin/reset", reset],
    // ["/usr/bin/chmod", chmod],
    // ["/usr/bin/chmod", chown],
];

export const defaultSymlinks: [string, string][] = [
    ["/usr/bin/clear", "/usr/bin/cls"],
];
