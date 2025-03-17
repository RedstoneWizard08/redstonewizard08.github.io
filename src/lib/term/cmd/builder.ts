export type ArgumentsHolder<V extends unknown[]> = {
    [I in keyof V]: { name: string; value: V[I] };
};

export type FlagsHolder<V extends unknown[]> = {
    [I in keyof V]: { name: string; short: string; value: V[I] };
};

export type CommandRunner<
    ArgTypes extends unknown[],
    FlagTypes extends unknown[],
    A extends ArgumentsHolder<ArgTypes>,
    F extends FlagsHolder<FlagTypes>,
> = (args: A, flags: F) => void | Promise<void>;

export class CommandBuilder<
    ArgTypes extends unknown[] = [],
    FlagTypes extends unknown[] = [],
    Args extends ArgumentsHolder<ArgTypes> = ArgumentsHolder<ArgTypes>,
    Flags extends FlagsHolder<FlagTypes> = FlagsHolder<FlagTypes>,
> {
    private _args: Args;
    private _flags: Flags;
    private _runners: CommandRunner<ArgTypes, FlagTypes, Args, Flags>[] = [];

    public constructor(args: Args, flags: Flags) {
        this._flags = flags;
        this._args = args;
    }

    /**
     * Add an argument with a default value.
     * @param name The name of the argument.
     * @param value The default value.
     */
    public arg<T>(
        name: string,
        value: T
    ): CommandBuilder<
        [...ArgTypes, T],
        FlagTypes,
        ArgumentsHolder<[...ArgTypes, T]>,
        Flags
    >;

    /**
     * Add an argument with an optional default value.
     * @param name The name of the argument.
     * @param value The optional default value.
     */
    public arg<T>(
        name: string,
        value?: T
    ): CommandBuilder<
        [...ArgTypes, T | undefined],
        FlagTypes,
        ArgumentsHolder<[...ArgTypes, T | undefined]>,
        Flags
    >;

    public arg<T>(
        name: string,
        value?: T
    ): CommandBuilder<
        [...ArgTypes, T | undefined],
        FlagTypes,
        ArgumentsHolder<[...ArgTypes, T | undefined]>,
        Flags
    > {
        return new CommandBuilder<
            [...ArgTypes, T | undefined],
            FlagTypes,
            ArgumentsHolder<[...ArgTypes, T | undefined]>,
            Flags
        >([...this._args, { name, value }], this._flags);
    }

    /**
     * Add a flag with a default value.
     * @param name The name of the flag.
     * @param value The default value.
     */
    public flag<T>(
        name: string,
        value: T
    ): CommandBuilder<
        ArgTypes,
        [...FlagTypes, T],
        Args,
        FlagsHolder<[...FlagTypes, T]>
    >;

    /**
     * Add a flag with an optional default value.
     * @param name The name of the flag.
     * @param value The optional default value.
     */
    public flag<T>(
        name: string,
        value?: T
    ): CommandBuilder<
        ArgTypes,
        [...FlagTypes, T | undefined],
        Args,
        FlagsHolder<[...FlagTypes, T | undefined]>
    >;

    public flag<T>(
        name: string,
        short: string,
        value?: T
    ): CommandBuilder<
        ArgTypes,
        [...FlagTypes, T | undefined],
        Args,
        FlagsHolder<[...FlagTypes, T | undefined]>
    > {
        return new CommandBuilder<
            ArgTypes,
            [...FlagTypes, T | undefined],
            Args,
            FlagsHolder<[...FlagTypes, T | undefined]>
        >(this._args, [...this._flags, { name, short, value }]);
    }

    public get flags() {
        return this._flags;
    }

    public get args() {
        return this._args;
    }
    
    public parse(argv: string[]) {
        for (const item of argv) {
            // TODO: Literally anything
        }

        return this;
    }

    public async run() {
        for (const run of this._runners) {
            await run(this._args, this._flags);
        }
    }

    public static new(): CommandBuilder {
        return new CommandBuilder([], []);
    }
}
