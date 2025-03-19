import { get } from "svelte/store";
import { gid, uid } from "./env";

export const generateFilesystem = async () => {
    const curUid = get(uid);
    const curGid = get(gid);

    uid.set(-1);
    gid.set(-1);

    // DO THINGS HERE

    uid.set(curUid);
    gid.set(curGid);
};
