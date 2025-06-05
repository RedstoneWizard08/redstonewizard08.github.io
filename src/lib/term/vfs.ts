import * as path from "@std/path";
import { get } from "svelte/store";
import { defaultDirs, defaultFiles, defaultSymlinks } from "./rootfs";
import {
    gid,
    uid,
    cwd,
    USER_UID,
    USER_GID,
    ROOT_UID,
    ROOT_GID,
    userMap,
} from "./env";
import type {
    IVirtFS,
    FileInfo,
    FileTree,
    FolderInfo,
    SymLinkInfo,
    VFSEntry,
    VFSFileStats,
} from "$$/system/vfs";
import { canRead, canWrite } from "./perms";

export const DEFAULT_PERMISSIONS = 0o664;

declare global {
    interface Window {
        _vfs: VirtualFS;
    }
}

// TODO: Relative symlinks
export class VirtualFS implements IVirtFS {
    public readonly tree: FileTree = new Map();

    public constructor() {
        this.bootstrap();
        window._vfs = this;
    }

    private resolvePath(input: string) {
        const pwd = get(cwd);

        const realPath = input.startsWith("/")
            ? path.normalize(input)
            : path.normalize(`${pwd}/${input}`);

        const parts = realPath
            .split("/")
            .filter((v) => v.trim() != "")
            .map((v) => v.trim());

        return parts;
    }

    private isRoot(input: string) {
        const pwd = get(cwd);

        const realPath = input.startsWith("/")
            ? path.normalize(input)
            : path.normalize(`${pwd}/${input}`);

        return realPath == "/";
    }

    private getFileName(input: string) {
        return this.resolvePath(input).pop()!;
    }

    private getParentTree(
        input: string,
        create: boolean = false,
        isFile: boolean = true,
        permissions: number = DEFAULT_PERMISSIONS,
        fileUid?: number,
        fileGid?: number,
        propogateCreate: boolean = true,
        ignoreFinalRead: boolean = false
    ) {
        if (this.isRoot(input)) {
            return this.tree;
        }

        const parts = this.resolvePath(input);
        let parentRef = this.tree;
        let vfsEntry: VFSEntry | null = null;

        if (isFile) parts.pop(); // Remove the name part

        for (const part of parts) {
            if (!parentRef.has(part)) {
                // If we are creating, create the directory, otherwise throw

                if (
                    create &&
                    !(!propogateCreate && part != parts[parts.length - 1])
                ) {
                    if (vfsEntry && !canWrite(get(uid), get(gid), vfsEntry)) {
                        throw new ReferenceError(
                            "ENOTPERM: Permission denied."
                        );
                    }

                    parentRef.set(part, {
                        tree: new Map(),
                        permissions,
                        owner: fileUid ?? get(uid),
                        group: fileGid ?? get(gid),
                    });
                } else {
                    throw new ReferenceError(
                        "ENOENT: Parent directory does not exist!"
                    );
                }
            }

            const entry = parentRef.get(part)!;

            if (
                "permissions" in entry &&
                !canRead(get(uid), get(gid), {
                    permissions: entry.permissions,
                    owner: entry.owner,
                    group: entry.group,
                    name: "",
                    type: "file", // this doesn't matter
                }) &&
                !(ignoreFinalRead && part == parts[parts.length - 1])
            ) {
                throw new ReferenceError("ENOTPERM: Permission denied.");
            }

            // If this is not a directory:
            if (!("tree" in entry)) {
                // Check if it's a symlink
                if ("target" in entry) {
                    // If it points to a file, throw
                    if (entry.kind == "file") {
                        throw new ReferenceError(
                            "ENOTDIR: Parent was not a directory!"
                        );
                    } else {
                        // Otherwise set its target as the parentRef
                        parentRef = this.getParentTree(
                            entry.target,
                            create && propogateCreate,
                            false,
                            permissions,
                            fileUid,
                            fileGid,
                            propogateCreate
                        );
                    }
                } else {
                    // Otherwise throw
                    throw new ReferenceError(
                        "ENOTDIR: Parent was not a directory!"
                    );
                }
            } else {
                vfsEntry = {
                    permissions: entry.permissions,
                    owner: entry.owner,
                    group: entry.group,
                    name: "",
                    type: "folder",
                };

                // If this is a directory, set it as the parent
                parentRef = entry.tree;
            }
        }

        return parentRef;
    }

    public create = this.write;

    public write(
        filePath: string,
        bytes: Uint8Array = new Uint8Array(),
        permissions = DEFAULT_PERMISSIONS
    ) {
        const parent = this.getParentTree(filePath, true, true, permissions);
        const fileName = this.getFileName(filePath);

        parent.set(fileName, {
            contents: bytes,
            permissions,
            owner: get(uid),
            group: get(gid),
        });
    }

    /**
     * Create a symlink pointing to `target` at `output`.
     * If `output` is a directory, create a new symlink with
     * `target`'s name in `output`.
     *
     * @param target The file/folder to point to.
     * @param output The place to put the symlink.
     */
    public symlink(
        target: string,
        output: string /* relative: boolean = false */
    ) {
        const targetStats = this.stat(target);

        if (!targetStats.exists) {
            throw new ReferenceError("Target path does not exist!");
        }

        const parent = this.getParentTree(output);
        const fileName = this.getFileName(output);

        if (parent.has(fileName)) {
            if ("tree" in parent.get(fileName)!) {
                (parent.get(fileName)! as FolderInfo).tree.set(fileName, {
                    target,
                    kind: targetStats.type == "file" ? "file" : "folder",
                    // relative,
                    relative: false,
                });
            } else {
                throw new ReferenceError("Symlink path already exists!");
            }
        } else {
            parent.set(fileName, {
                target,
                kind: targetStats.type == "file" ? "file" : "folder",
                // relative,
                relative: false,
            });
        }
    }

    public remove(filePath: string) {
        const parent = this.getParentTree(filePath);
        const fileName = this.getFileName(filePath);

        if (!parent.has(fileName))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot remove!`
            );

        if ("tree" in parent.get(fileName)!)
            throw new RangeError(
                `Entry at path ${filePath} is a directory! Cannot remove!`
            );

        parent.delete(fileName);
    }

    public removeTree(filePath: string) {
        if (filePath == "/") {
            const keys = this.tree.keys();

            for (const key of keys) {
                this.tree.delete(key);
                return;
            }
        }

        const parent = this.getParentTree(filePath);
        const fileName = this.getFileName(filePath);

        if (!parent.has(fileName))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot remove whole tree!`
            );

        if (!("tree" in parent.get(fileName)!))
            throw new RangeError(
                `Entry at path ${filePath} is a file! Cannot remove whole tree!`
            );

        parent.delete(fileName);
    }

    public read(filePath: string): FileInfo | undefined {
        const parent = this.getParentTree(filePath);
        const fileName = this.getFileName(filePath);

        if (!parent.has(fileName))
            throw new RangeError(
                `Entry at path ${filePath} does not exist! Cannot read!`
            );

        if ("tree" in parent.get(fileName)!)
            throw new RangeError(
                `Entry at path ${filePath} is a directory! Cannot read!`
            );

        if ("target" in parent.get(fileName)!)
            return this.read((parent.get(fileName) as SymLinkInfo).target);

        return parent.get(fileName) as FileInfo;
    }

    public stat(filePath: string): VFSFileStats {
        if (this.isRoot(filePath)) {
            return {
                exists: true,
                group: -1,
                owner: -1,
                permissions: 0o777,
                name: "/",
                type: "folder",
            };
        }

        try {
            const parent = this.getParentTree(filePath);
            const fileName = this.getFileName(filePath);

            if (!parent.has(fileName)) return { exists: false };

            if ("tree" in parent.get(fileName)!) {
                const it = parent.get(fileName)! as FolderInfo;

                return {
                    exists: true,
                    group: it.group,
                    name: fileName,
                    owner: it.owner,
                    permissions: it.permissions,
                    type: "folder",
                };
            }

            if ("target" in parent.get(fileName)!) {
                const it = parent.get(fileName)! as SymLinkInfo;
                const result = this.stat(it.target);

                return Object.assign(result, {
                    type: result.exists
                        ? result.type == "symlink-broken"
                            ? "symlink-broken"
                            : "symlink"
                        : "symlink-broken",
                    kind: it.kind,
                });
            }

            const it = parent.get(fileName)! as FileInfo;

            return {
                exists: true,
                group: it.group,
                name: fileName,
                owner: it.owner,
                permissions: it.permissions,
                type: "file",
            };
        } catch (_ex) {
            return { exists: false };
        }
    }

    public exists(filePath: string): boolean {
        return this.stat(filePath).exists;
    }

    public mkdirs(
        dirPath: string,
        permissions: number = DEFAULT_PERMISSIONS,
        uid?: number,
        gid?: number
    ) {
        this.getParentTree(
            dirPath,
            true,
            false,
            permissions,
            uid,
            gid,
            true,
            true
        );
    }

    public mkdir(
        dirPath: string,
        permissions: number = DEFAULT_PERMISSIONS,
        uid?: number,
        gid?: number
    ) {
        this.getParentTree(
            dirPath,
            true,
            false,
            permissions,
            uid,
            gid,
            false,
            true
        );
    }

    public readdir(path: string) {
        const parent = this.getParentTree(path, false, false);
        const data: VFSEntry[] = [];

        for (const [name, info] of parent.entries()) {
            if ("target" in info) {
                // TODO: Relative paths
                const stats = this.stat(info.target);

                if (stats.exists) {
                    data.push({
                        name,
                        type: "symlink",
                        permissions: stats.permissions,
                        owner: stats.owner,
                        group: stats.group,
                    });
                } else {
                    data.push({
                        name,
                        type: "symlink-broken",
                        permissions: -1,
                        owner: -1,
                        group: -1,
                    });
                }
            } else {
                data.push({
                    name,
                    type: "tree" in info ? "folder" : "file",
                    permissions: info.permissions,
                    owner: info.owner,
                    group: info.group,
                });
            }
        }

        return data;
    }

    public reset() {
        this.bootstrap();
    }

    private bootstrap() {
        this.tree.clear();
        uid.set(ROOT_UID);
        gid.set(ROOT_GID);

        for (const [path, permissions] of defaultDirs) {
            this.mkdirs(path, permissions);
        }

        for (const [path, data] of defaultFiles) {
            this.write(path, new TextEncoder().encode(data), 0o555);
        }

        for (const [target, path] of defaultSymlinks) {
            this.symlink(target, path);
        }

        for (const [id, name] of Object.entries(userMap) as unknown as [
            number,
            string,
        ][]) {
            this.mkdirs(`/home/${name}`, 0o700, id, id);
        }

        uid.set(USER_UID);
        gid.set(USER_GID);
    }
}

export const vfs = new VirtualFS();
