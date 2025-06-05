declare module "$$/system/vfs" {
    export type FileTree = Map<string, FileInfo | FolderInfo | SymLinkInfo>;

    export type VFSFileStats =
        | (VFSEntry & { exists: true })
        | { exists: false };

    export interface BaseEntryInfo {
        permissions: number;
        owner: number;
        group: number;
    }

    export interface FileInfo extends BaseEntryInfo {
        contents: Uint8Array;
    }

    export interface FolderInfo extends BaseEntryInfo {
        tree: FileTree;
    }

    export interface SymLinkInfo {
        kind: "file" | "folder";
        target: string;
        relative: boolean;
    }

    export interface VFSEntry {
        name: string;
        type: "file" | "folder" | "symlink" | "symlink-broken";

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

        /**
         * The type of symlink this is, if it is one.
         */
        kind?: "file" | "folder";
    }

    export interface IVirtFS {
        create: (
            filePath: string,
            bytes?: Uint8Array,
            permissions?: number
        ) => void;

        write: (
            filePath: string,
            bytes?: Uint8Array,
            permissions?: number
        ) => void;

        /**
         * Create a symlink pointing to `target` at `output`.
         * If `output` is a directory, create a new symlink with
         * `target`'s name in `output`.
         *
         * @param target The file/folder to point to.
         * @param output The place to put the symlink.
         */
        symlink: (
            target: string,
            output: string /* relative: boolean = false */
        ) => void;

        remove: (filePath: string) => void;
        removeTree: (filePath: string) => void;
        read: (filePath: string) => FileInfo | undefined;
        stat: (filePath: string) => VFSFileStats;
        exists: (filePath: string) => boolean;
        mkdirs: (dirPath: string, permissions?: number) => void;
        mkdir: (dirPath: string, permissions?: number) => void;
        readdir: (path: string) => VFSEntry[];
        reset: () => void;
    }
}
