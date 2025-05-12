export class CommandError extends Error {
    public constructor(message: string, opts?: ErrorOptions) {
        super(message, opts);
    }
}

export class ExitError extends Error {
    public readonly code: number;

    public constructor(code?: number) {
        super(`Process Exited: ${code ?? 0}`);
        this.code = code ?? 0;
    }
}
