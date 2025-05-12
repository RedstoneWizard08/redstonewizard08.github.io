declare module "$$/system/core" {
    import type { IVirtFS } from "$$/system/vfs";
    import type { ProcessInfo } from "$$/system/process";

    const vfs: IVirtFS;
    const process: ProcessInfo;
    const cwd: string;
    const uid: number;
    const gid: number;
    const user: string;
    const group: string;
    const machineInfo: string;
    const hostname: string;
    const env: Map<string, string>;
    const defaultEnv: Record<string, string>;

    function chdir(to: string): void;
    function exit(code?: number): void;
}
