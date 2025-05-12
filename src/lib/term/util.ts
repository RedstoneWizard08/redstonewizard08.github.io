import type { ClassValue } from "svelte/elements";

export const intToU32Bytes = (val: number) => [
    val & 0xff,
    (val >> 8) & 0xff,
    (val >> 16) & 0xff,
    (val >> 24) & 0xff,
];

export const u32BytesToInt = (val: FixedLengthArray<number, 4>) =>
    val[0] | (val[1] << 8) | (val[2] << 16) | (val[3] << 24);

export const htmlText = (key: string) =>
    key
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll(" ", "&nbsp;")
        .replaceAll("\n", "<br/>");

export const unHtml = (key: string) =>
    key
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&nbsp;", " ")
        .replaceAll("<br/>", "\n");

export const arraysEqual = <T>(a: T[], b: T[]) =>
    a.length === b.length && a.every((element, index) => element === b[index]);

export interface FixedLengthArray<T extends any, L extends number>
    extends Array<T> {
    0: T;
    length: L;
}

export const styled = (classes: ClassValue, text: string) =>
    `<span class="${classes}">${text}</span>`;

export const delay = (time: number) =>
    new Promise((res, _rej) => setTimeout(res, time));
