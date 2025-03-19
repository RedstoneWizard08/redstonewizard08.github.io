declare module "$$/system/core" {
    import type { IVirtFS } from "$$/system/vfs";
    import type { ProcessInfo } from "$$/system/process";

    declare const vfs: IVirtFS;
    declare const process: ProcessInfo;
    declare const cwd: string;
    declare const uid: number;
    declare const gid: number;
    declare const user: string;
    declare const group: string;
    declare const machineInfo: string;
    declare const hostname: string;
    declare const env: Map<string, string>;

    declare function chdir(to: string);
}
