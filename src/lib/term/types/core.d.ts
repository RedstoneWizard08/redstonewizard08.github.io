declare module "$$/system/core" {
    import type { IVirtFS } from "$$/system/vfs";
    import type { ProcessInfo } from "$$/system/process";

    declare const vfs: IVirtFS;
    declare const process: ProcessInfo;
    declare const cwd: string;
}
