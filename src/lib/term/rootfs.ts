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
    which,
    mkdir,
} = modules;

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
    ["/opt", 0o755],
    ["/proc", 0o700],
    ["/run", 0o700],
];

export const defaultFiles: DefaultFiles<string, string> = [
    ["/usr/bin/echo", echo],
    ["/usr/bin/ls", ls],
    ["/usr/bin/cat", cat],
    ["/usr/bin/rsh", rsh],
    ["/usr/bin/mkdir", mkdir],
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
    // ["/usr/bin/chown", chown],
    ["/usr/bin/sysinfo", sysinfo],
    ["/usr/bin/export", exportCmd],
    ["/usr/bin/exit", exit],
    ["/usr/bin/unset", unset],
    ["/usr/bin/which", which],

    ["/etc/sudoers", "web-user\nroot"],
];

export const defaultSymlinks: [string, string][] = [
    ["/usr/bin/clear", "/usr/bin/cls"],
    ["/usr/lib", "/lib"],
    ["/usr/bin", "/bin"],
];
