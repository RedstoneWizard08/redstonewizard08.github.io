import type { VFSEntry } from "$$/system/vfs";
import { ROOT_GID, ROOT_UID } from "./info";

export interface TargetPermissions {
    read: boolean;
    write: boolean;
    execute: boolean;
}

export interface FilePermissions {
    owner: TargetPermissions;
    group: TargetPermissions;
    other: TargetPermissions;
}

export const readPermissions = (targetMask: number): TargetPermissions => {
    // 0b1: "Hello there."
    const read = ((targetMask >> 2) & 0b1) == 1;
    const write = ((targetMask >> 1) & 0b1) == 1;
    const execute = (targetMask & 0b1) == 1;

    return { read, write, execute };
};

export const readFilePermissions = (mask: number): FilePermissions => {
    const owner = (mask >> 6) & 0b111;
    const group = (mask >> 3) & 0b111;
    const other = mask & 0b111;

    return {
        owner: readPermissions(owner),
        group: readPermissions(group),
        other: readPermissions(other),
    };
};

export const writePermissions = (targetPerms: TargetPermissions) => {
    let mask = 0;

    if (targetPerms.read) mask |= 0b100;
    if (targetPerms.write) mask |= 0b010;
    if (targetPerms.execute) mask |= 0b001;

    return mask;
};

export const writeFilePermissions = (perms: FilePermissions) => {
    const owner = writePermissions(perms.owner);
    const group = writePermissions(perms.group);
    const other = writePermissions(perms.other);

    return (owner << 6) | (group << 3) | other;
};

export const canRead = (uid: number, gid: number, file: VFSEntry) => {
    const perms = readFilePermissions(file.permissions);

    const target =
        file.owner == uid
            ? perms.owner
            : file.group == gid
              ? perms.group
              : perms.other;

    return target.read || uid == ROOT_UID || gid == ROOT_GID;
};

export const canWrite = (uid: number, gid: number, file: VFSEntry) => {
    const perms = readFilePermissions(file.permissions);

    const target =
        file.owner == uid
            ? perms.owner
            : file.group == gid
              ? perms.group
              : perms.other;

    return target.write || uid == ROOT_UID || gid == ROOT_GID;
};

export const canExecute = (uid: number, gid: number, file: VFSEntry) => {
    const perms = readFilePermissions(file.permissions);

    const target =
        file.owner == uid
            ? perms.owner
            : file.group == gid
              ? perms.group
              : perms.other;

    // I don't care if you're root, you still need to `chmod +x`
    // :troll_lq:
    return target.execute;
};

export const printTargetPermissions = (perms: TargetPermissions) => {
    return (
        (perms.read ? "r" : "-") +
        (perms.write ? "w" : "-") +
        (perms.execute ? "x" : "-")
    );
};

export const printFilePermissions = (perms: FilePermissions) => {
    return (
        printTargetPermissions(perms.owner) +
        printTargetPermissions(perms.group) +
        printTargetPermissions(perms.other)
    );
};

export const printPermissions = (mask: number) =>
    printFilePermissions(readFilePermissions(mask));
