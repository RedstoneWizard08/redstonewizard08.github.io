import type { ProjectInfo } from "./types.ts";

export const createDesc = (proj: ProjectInfo) => {
    let desc = "";
    let found = false;

    for (const line of proj.readme.split("\n")) {
        if (line.startsWith("## Overview")) {
            found = true;
            continue;
        }

        if (line.trim() == "" || !found) continue;

        desc = line;
        break;
    }

    return desc.substring(0, Math.min(70, desc.length)).trim() + "...";
};
