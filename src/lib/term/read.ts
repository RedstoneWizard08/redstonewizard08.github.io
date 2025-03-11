import type { FixedLengthArray } from "./util";

export class ByteReader {
    private _inner: Uint8Array;
    private _pos = 0;

    public constructor(inner: Uint8Array) {
        this._inner = inner;
    }

    public read() {
        this._pos++;
        return this._inner[this._pos - 1];
    }

    public readCount<N extends number>(num: N) {
        const arr: FixedLengthArray<number, N> = [] as any;

        for (let i = 0; i < num; i++) {
            arr.push(this.read());
        }

        return arr;
    }

    public hasNext() {
        return this._pos < this._inner.length - 1;
    }
}
