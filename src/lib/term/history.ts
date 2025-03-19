import { writable } from "svelte/store";

export class HistoryHolder {
    private index = -1;
    private history: string[] = [];

    public get isBlank() {
        return this.index < 0;
    }

    public toBlank() {
        this.index = -1;
    }

    public back() {
        this.index = Math.max(-1, this.index - 1);
    }

    public next() {
        this.index = Math.max(
            -1,
            this.index + 1 >= this.history.length ? this.index : this.index + 1
        );
    }

    public get() {
        if (this.isBlank) return "";
        return this.history[this.index];
    }

    public push(entry: string) {
        this.history.push(entry);
    }

    public pop() {
        return this.history.pop();
    }

    public shift() {
        return this.history.shift();
    }
}

export const history = writable(new HistoryHolder());
