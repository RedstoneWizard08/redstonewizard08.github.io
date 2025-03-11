import { get } from "svelte/store";
import { termClipboardPermission } from "../stores";
import { unHtml } from "./util";

export const HIGHLIGHT_START = `<span class="bg-purple">`;
export const HIGHLIGHT_END = `</span>`;

export const requestClipboardPermission = async () => {
    if (get(termClipboardPermission)) return;

    const read = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
    });
    const write = await navigator.permissions.query({
        name: "clipboard-write" as PermissionName,
    });

    if (
        (read.state == "granted" || read.state == "prompt") &&
        (write.state == "granted" || write.state == "prompt")
    ) {
        termClipboardPermission.set(true);
    }
};

export const isHighlighted = (buf: string) => buf.startsWith(HIGHLIGHT_START);
export const unHighlight = (buf: string) =>
    buf.slice(HIGHLIGHT_START.length, -HIGHLIGHT_END.length);

export const toggleHighlight = (buf: string) => {
    if (buf.startsWith(HIGHLIGHT_START)) return unHighlight(buf);

    return HIGHLIGHT_START + buf + HIGHLIGHT_END;
};

export const maybeCopy = async (buf: string) => {
    const shouldCopy = isHighlighted(buf);

    if (shouldCopy) {
        await requestClipboardPermission();

        navigator.clipboard.writeText(unHighlight(unHtml(buf)));
    }

    return shouldCopy;
};
