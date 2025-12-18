import { get } from "svelte/store";
import { gid, uid } from "./env";
import { vfs } from "./vfs.ts";
import { logInit, logInitPre } from "./init.ts";

export const generateFilesystem = async () => {
    const curUid = get(uid);
    const curGid = get(gid);

    uid.set(-1);
    gid.set(-1);

    vfs.mkdirs("/home/web-user");

    uid.set(curUid);
    gid.set(curGid);
};
