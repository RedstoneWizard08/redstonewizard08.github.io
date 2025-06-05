declare module "$$/system/fmt" {
    function clearScreen(): void;
    function println(text?: string): void;
    function logInfo(text?: string): void;
    function logWarn(text?: string): void;
    function logError(text?: string): void;
}
