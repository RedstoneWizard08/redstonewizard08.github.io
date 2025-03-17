export class CommandError extends Error {
    public constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}
