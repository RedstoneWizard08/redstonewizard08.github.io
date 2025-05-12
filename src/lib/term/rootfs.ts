import { modules } from "./files.ts";

const {
    ls,
    cat,
    echo,
    rsh,
    rm,
    touch,
    cd,
    help,
    whoami,
    hostname,
    uname,
    date,
    pwd,
    clear,
    id,
    reset,
    sysinfo,
    exportCmd,
    exit,
    unset,
    wasmer,
} = modules;

export type DefaultFiles<K, V> = readonly [...[K, V][]];

export const defaultDirs: [string, number][] = [
    ["/bin", 0o755],
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
    ["/usr/bin/rsh", rsh],
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
    ["/usr/bin/sysinfo", sysinfo],
    ["/usr/bin/export", exportCmd],
    ["/usr/bin/exit", exit],
    ["/usr/bin/unset", unset],
    ["/usr/bin/wasmer", wasmer],
];

export const defaultSymlinks: [string, string][] = [
    ["/usr/bin/rsh", "/bin/rsh"],
    ["/usr/bin/clear", "/usr/bin/cls"],
];
