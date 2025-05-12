import { type Instance, Wasmer } from "@wasmer/sdk";

declare module "$$/system/wasm" {
    function getWasm(): typeof Wasmer;
    function connectStreams(instance: Instance): () => void;
}
