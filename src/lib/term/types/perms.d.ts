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

    declare function readPermissions(targetMask: number): TargetPermissions;
    declare function readFilePermissions(mask: number): FilePermissions;
    declare function writePermissions(targetPerms: TargetPermissions): number;
    declare function writeFilePermissions(perms: FilePermissions): number;
    declare function canRead(uid: number, gid: number, file: VFSEntry): boolean;
    declare function canWrite(
        uid: number,
        gid: number,
        file: VFSEntry
    ): boolean;
    declare function canExecute(
        uid: number,
        gid: number,
        file: VFSEntry
    ): boolean;
    declare function printTargetPermissions(perms: TargetPermissions): string;
    declare function printFilePermissions(perms: FilePermissions): string;
    declare function printPermissions(mask: number): string;
}
