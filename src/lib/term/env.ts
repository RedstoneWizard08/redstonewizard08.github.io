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
export const cwd = writable<string>("/home/web-user");
export const hostname = writable<string>("redstone");
export const inApp = writable<boolean>(false);

export const defaultEnv = Object.freeze({
    PATH: "/bin:/usr/bin:/usr/local/bin",
    // PS1: "$ ",
    PS1: "\x1b[36m[\x1b[96m$PWD\x1b[36m]\x1b[0m \x1b[38;5;171m$\x1b[0m ",
    LANG: "en_US.UTF-8",
    LANGUAGE: "en_US:en",
    SHELL: "/bin/rsh",
    TERM: "xterm-256color",
    COLORTERM: "truecolor",
});

export class EnvMap extends Map<string, string> {
    override delete(key: string): boolean {
        if (["?", "PWD", "USER", "LOGNAME", "GROUP", "HOME"].includes(key)) {
            return false;
        }

        return super.delete(key);
    }

    override has(key: string): boolean {
        switch (key) {
            case "PWD":
            case "USER":
            case "LOGNAME":
            case "GROUP":
            case "HOME":
                return true;
            default:
                return super.has(key);
        }
    }

    override get(key: string): string | undefined {
        switch (key) {
            case "PWD":
                return get(cwd);
            case "USER":
            case "LOGNAME":
                return userMap[get(uid)];
            case "GROUP":
                return groupMap[get(gid)];
            case "HOME":
                return "/home/" + this.get("USER");
            default:
                return super.get(key);
        }
    }
}

export const env = writable<Map<string, string>>(
    new EnvMap(Object.entries(defaultEnv))
);

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

export const setDefaultEnv = () => {
    get(env).clear();
    Object.entries(defaultEnv).forEach(([k, v]) => get(env).set(k, v));
};

export const fillEnv = (input: string) =>
    input
        .replace(
            /([^\\]?)\$([A-Za-z0-9_]+)/gm,
            (_str, pre, g1) =>
                pre +
                (get(env).has(g1)
                    ? get(env).get(g1)!.replaceAll("\x1b", "\\x1b")
                    : "$" + g1)
        )
        .replaceAll("$?", get(env).get("?") ?? "$?")
        .replaceAll("\\$", "$");
