import { get, writable } from "svelte/store";

export const ROOT_UID = -1;
export const ROOT_GID = -1;
export const ROOT_NAME = "root";

export const USER_UID = 1;
export const USER_GID = 1;
export const USER_NAME = "web-user";

export const MACHINE_INFO =
    "WebOS %host% 0.1.0-redstone %date% js js js Web/WebOS";

export const uid = writable<number>(-1);
export const gid = writable<number>(-1);
export const cwd = writable<string>("/");
export const hostname = writable<string>("redstone");

export const getMachineInfo = () =>
    MACHINE_INFO.replace("%host%", get(hostname)).replace(
        "%date%",
        new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
            timeStyle: "long",
        }).format(Date.now())
    );

export const userMap: Record<number, string> = Object.fromEntries([
    [ROOT_UID, ROOT_NAME],
    [USER_UID, USER_NAME],
]);

export const groupMap: Record<number, string> = Object.fromEntries([
    [ROOT_GID, ROOT_NAME],
    [USER_GID, USER_NAME],
]);
