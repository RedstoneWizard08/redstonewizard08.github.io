export const splitToCommands = (buf: string) => {
    const rawScript = buf
        .trim()
        .split("\n")
        .map((v) => v.trim());

    const scriptLines = [];

    let buffer: string | null = null;

    for (const line of rawScript) {
        if (line.endsWith("\\")) {
            if (buffer) buffer += " " + line;
            else buffer = line;
            continue;
        }

        if (buffer) {
            buffer = null;
            scriptLines.push(buffer + " " + line);
        } else {
            scriptLines.push(line);
        }
    }

    const scriptText = scriptLines.join(";");
    const script = [];

    let currentStmt = "";

    for (const ch of scriptText) {
        if (ch == ";") {
            if (currentStmt != "") script.push(currentStmt);

            currentStmt = "";
        } else {
            currentStmt += ch;
        }
    }

    if (currentStmt != "") script.push(currentStmt);

    return script;
};
