import { ByteReader } from "./read";
import { arraysEqual, u32BytesToInt } from "./util";

const expectedHead = [0xb, 0xa, 0xd, 0xe];
const expectedVersion = [0x0, 0x1, 0x0, 0x0];
const intrinsicCallingConvention = [0xc, 0xc, 0x0, 0x1];
const intrinsicCall = [0xc, 0xa, 0x1, 0x1];

export const readBinFile = (data: Uint8Array) => {
    const reader = new ByteReader(data);
    const head = reader.readCount(4);
    const version = reader.readCount(4);
    const callingConvention = reader.readCount(4);

    if (!arraysEqual(head, expectedHead))
        throw new ReferenceError("Unknown header: " + head);

    if (!arraysEqual(version, expectedVersion))
        throw new ReferenceError("Unknown binary version: " + version);

    if (!arraysEqual(callingConvention, intrinsicCallingConvention))
        throw new ReferenceError(
            "Unknown calling convention: " + callingConvention
        );

    const msgLen = u32BytesToInt(reader.readCount(4));

    reader.readCount(msgLen);

    const call = reader.readCount(4);

    if (!arraysEqual(call, intrinsicCall))
        throw new ReferenceError("Unknown call descriptor: " + call);

    const nameLen = u32BytesToInt(reader.readCount(4));
    const name = reader.readCount(nameLen);

    name.pop(); // pop the null terminator

    return new TextDecoder().decode(new Uint8Array(name));
};
