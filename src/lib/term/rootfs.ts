import { intToU32Bytes } from "./util";

export type DefaultFiles<K, V> = readonly [...[K, V][]];

export const builtInMessage =
    "This is a built-in command. Its implementation is done in JavaScript, but is called through this file in the VFS.";

const builtInBin = (name: string) =>
    new Uint8Array([
        // BAD-E (bad exeecutable :P)
        0xb,
        0xa,
        0xd,
        0xe,
        // [major] [minor] [patch] [rev]
        0x0,
        0x1,
        0x0,
        0x0,
        // header
        // 0xC, 0xC = Calling Convention
        // type: 0x0, 0x1 = intrinsic call
        0xc,
        0xc,
        0x0,
        0x1,
        // metadata (unused right now)
        // metadata size (u32), includes null terminator
        ...intToU32Bytes(builtInMessage.length + 1),
        // null-terminated metadata
        ...new TextEncoder().encode(builtInMessage),
        0x0,
        // the intrinsic call
        // 0xC, 0xA, 0x1, 0x1 = CA11 = CALL
        0xc,
        0xa,
        0x1,
        0x1,
        // the size of the call name
        ...intToU32Bytes(name.length + 1),
        // null-terminated call name
        ...new TextEncoder().encode(name),
        0x0,
    ]);

export const defaultDirs = [
    "/usr",
    "/usr/bin",
    "/usr/lib",
    "/usr/local",
    "/usr/local/bin",
    "/usr/local/lib",
    "/etc",
    "/var",
    "/var/lib",
    "/home/user",
];

export const defaultFiles: DefaultFiles<string, Uint8Array> = [
    ["/usr/bin/echo", builtInBin("echo")],
    ["/usr/bin/ls", builtInBin("ls")],
    ["/usr/bin/cat", builtInBin("cat")],
    ["/usr/bin/rsh", builtInBin("rsh")],
    ["/usr/bin/mkdir", builtInBin("mkdir")],
    ["/usr/bin/rm", builtInBin("rm")],
    ["/usr/bin/touch", builtInBin("touch")],
    // ["/usr/bin/ed", builtInBin("ed")],
    ["/usr/bin/cd", builtInBin("cd")],
    ["/usr/bin/cp", builtInBin("cp")],
    ["/usr/bin/help", builtInBin("help")],
    ["/usr/bin/whoami", builtInBin("whoami")],
    ["/usr/bin/hostname", builtInBin("hostname")],
    ["/usr/bin/uname", builtInBin("uname")],
    ["/usr/bin/date", builtInBin("date")],
    ["/usr/bin/mv", builtInBin("mv")],
    ["/usr/bin/pwd", builtInBin("pwd")],
    ["/usr/bin/rmdir", builtInBin("rmdir")],
];
