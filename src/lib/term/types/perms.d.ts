import type { VFSEntry } from "$$/system/vfs";

declare module "$$/system/permissions" {
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

    function readPermissions(targetMask: number): TargetPermissions;
    function readFilePermissions(mask: number): FilePermissions;
    function writePermissions(targetPerms: TargetPermissions): number;
    function writeFilePermissions(perms: FilePermissions): number;
    function canRead(uid: number, gid: number, file: VFSEntry): boolean;
    function canWrite(uid: number, gid: number, file: VFSEntry): boolean;
    function canExecute(uid: number, gid: number, file: VFSEntry): boolean;
    function printTargetPermissions(perms: TargetPermissions): string;
    function printFilePermissions(perms: FilePermissions): string;
    function printPermissions(mask: number): string;
}
