import { get } from "svelte/store";
import { defaultDirs, defaultFiles } from "./rootfs";
import { gid, uid } from "./info";

export type FileTree = Map<string, FileInfo | FolderInfo>;

export interface FolderInfo {
    permissions: number;
    owner: number;
    group: number;
    tree: FileTree;
}

export interface FileInfo extends Omit<FolderInfo, "tree"> {
    contents: Uint8Array;
}

export interface VFSEntry {
    name: string;
    type: "file" | "folder";

    /**
     * The octal permissions flags.
     *
     * When converted into binary:
     *
     * | [r][w][x] | [r][w][x] | [r][w][x] |
     * | :-------- | :-------- | :-------- |
     * | owner     | group     | other     |
     */
    permissions: number;

    /**
     * The UID of the owner.
     */
    owner: number;

    /**
     * The GID of the owner.
     */
    group: number;
}

export type VFSFileStats = Partial<VFSEntry> & { exists: boolean };

export const DEFAULT_PERMISSIONS = 0o664;

export class VirtualFS {
    public readonly tree: FileTree = new Map();

    public constructor() {
        this.bootstrap();
    }

    public create = this.write;

    public write(
        filePath: string,
        bytes: Uint8Array = new Uint8Array(),
        permissions = DEFAULT_PERMISSIONS
    ) {
        const parts = filePath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        const name = parts.pop()!;
        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part))
                parentRef.set(part, {
                    tree: new Map(),
                    permissions: DEFAULT_PERMISSIONS,
                    owner: get(uid),
                    group: get(gid),
                });

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(
                    `Entry at path ${filePath} already exists! Cannot create directory.`
                );
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        parentRef.set(name, {
            contents: bytes,
            permissions,
            owner: get(uid),
            group: get(gid),
        });
    }

    public remove(filePath: string) {
        const parts = filePath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        const name = parts.pop()!;
        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part)) return;

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(
                    `Entry at path ${filePath} does not exist! Cannot remove!`
                );
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        if (!parentRef.has(name))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot remove!`
            );

        if ("tree" in parentRef.get(name)!)
            throw new RangeError(
                `Entry at path ${filePath} is a directory! Cannot remove!`
            );

        parentRef.delete(name);
    }

    public removeTree(filePath: string) {
        if (filePath == "/") {
            const keys = this.tree.keys();

            for (const key of keys) {
                this.tree.delete(key);
                return;
            }
        }

        const parts = filePath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        const name = parts.pop()!;
        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part)) return;

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(
                    `Entry at path ${filePath} does not exist! Cannot remove whole tree!`
                );
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        if (!parentRef.has(name))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot remove whole tree!`
            );

        if (!("tree" in parentRef.get(name)!))
            throw new RangeError(
                `Entry at path ${filePath} is a file! Cannot remove whole tree!`
            );

        parentRef.delete(name);
    }

    public read(filePath: string) {
        const parts = filePath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        const name = parts.pop()!;
        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part)) return;

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(
                    `Entry at path ${filePath} does not exist! Cannot read!`
                );
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        if (!parentRef.has(name))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot read!`
            );

        if ("tree" in parentRef.get(name)!)
            throw new RangeError(
                `Entry at path ${filePath} is a directory! Cannot read!`
            );

        return parentRef.get(name) as FileInfo;
    }

    public stat(filePath: string): VFSFileStats {
        if (filePath == "/") {
            return {
                exists: true,
                group: -1,
                owner: -1,
                permissions: 0o777,
                name: "/",
                type: "folder",
            };
        }
        
        const parts = filePath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        const name = parts.pop()!;
        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part) || !("tree" in parentRef.get(part)!)) {
                return { exists: false };
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        if (!parentRef.has(name)) return { exists: false };

        if ("tree" in parentRef.get(name)!) {
            const it = parentRef.get(name)! as FolderInfo;

            return {
                exists: true,
                group: it.group,
                name,
                owner: it.owner,
                permissions: it.permissions,
                type: "folder",
            };
        }

        const it = parentRef.get(name)! as FileInfo;

        return {
            exists: true,
            group: it.group,
            name,
            owner: it.owner,
            permissions: it.permissions,
            type: "file",
        };
    }

    public mkdirs(dirPath: string) {
        const parts = dirPath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part))
                parentRef.set(part, {
                    tree: new Map(),
                    permissions: DEFAULT_PERMISSIONS,
                    owner: get(uid),
                    group: get(gid),
                });

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(
                    `Entry at path ${dirPath} already exists! Cannot create directory.`
                );
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }
    }

    public readdir(path: string) {
        const parts = path
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        let parentRef = this.tree;

        for (const part of parts) {
            if (!parentRef.has(part)) return;

            if (!("tree" in parentRef.get(part)!)) {
                throw new RangeError(`Entry at path ${path} does not exist!`);
            }

            parentRef = (parentRef.get(part)! as FolderInfo).tree;
        }

        const data: VFSEntry[] = [];

        for (const [name, info] of parentRef.entries()) {
            data.push({
                name,
                type: "tree" in info ? "folder" : "file",
                permissions: info.permissions,
                owner: info.owner,
                group: info.group,
            });
        }

        return data;
    }

    private bootstrap() {
        for (const [path, data] of defaultFiles) {
            this.write(path, data, 0o777);
        }

        for (const item of defaultDirs) {
            this.mkdirs(item);
        }
    }
}
