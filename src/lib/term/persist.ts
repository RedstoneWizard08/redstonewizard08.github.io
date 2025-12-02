import {
    decode,
    encode,
    type AbstractClassType,
    type TypeEncoder,
} from "cbor2";
import { registerEncoder, clearEncoder } from "cbor2/encoder";
import { compressSync, decompressSync } from "fflate";
import type { FileTree } from "$$/system/vfs";

export interface PersistedData {
    vfs: FileTree;
    env: Map<string, string>;
    users: Map<number, string>;
    groups: Map<number, string>;
}

const transform = (obj: any) => {
    for (const key of Object.keys(obj) as (keyof typeof obj)[]) {
        if (
            typeof obj[key] == "object" &&
            "__type" in obj[key] &&
            obj[key]["__type"] == "js.Map"
        ) {
            obj[key] = new Map(Object.entries(transform(obj[key])));
            obj[key].delete("__type");
        } else if (typeof obj[key] == "object") {
            obj[key] = transform(obj[key]);
        }
    }

    return obj;
};

const enc = <T extends AbstractClassType<T>>(ctor: T) =>
    clearEncoder(ctor) as TypeEncoder<InstanceType<T>>;

const map = enc(Map);

registerEncoder(Map, (obj, w, opts) => {
    obj.set("__type", "js.Map");
    map(obj, w, opts);

    return undefined;
});

export const encodeData = (
    vfs: FileTree,
    env: Map<string, string>,
    users: Map<number, string>,
    groups: Map<number, string>
) => {
    const data = {
        vfs,
        env,
        users,
        groups,
    };

    const encoded = compressSync(
        encode(data, {
            collapseBigInts: true,
            forceEndian: true,
            rejectBigInts: true,
            cde: true,
        })
    );

    return encoded;
};

export const decodeData = (encoded: Uint8Array): PersistedData => {
    const dec = transform(
        decode(decompressSync(encoded), {
            rejectBigInts: true,
            cde: true,
        })
    );

    return dec;
};
