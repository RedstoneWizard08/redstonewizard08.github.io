<script lang="ts">
    import { onMount } from "svelte";
    import {
        termBuffer,
        termContent,
        termCursorPosition,
        termPrompt,
        termHistory,
    } from "../lib/stores";
    import initUno from "@unocss/runtime";
    import unoConfig from "../../uno.config";
    import { htmlText } from "../lib/term/util";
    import {
    HIGHLIGHT_END,
        HIGHLIGHT_START,
        isHighlighted,
        maybeCopy,
        requestClipboardPermission,
        toggleHighlight,
    } from "../lib/term/highlight";
    import { executeScript } from "../lib/term/exec";

    const preBuffer = $derived(
        $termBuffer.slice(0, $termBuffer.length - $termCursorPosition)
    );

    const postBuffer = $derived(
        $termBuffer.slice($termBuffer.length - $termCursorPosition)
    );

    let win: HTMLDivElement;
    let curHistoryIndex = $state(-1);

    onMount(() => {
        window.addEventListener("keydown", onKey);
        initUno({ defaults: unoConfig });
    });

    const onKey = async (ev: KeyboardEvent) => {
        switch (ev.code) {
            case "Backspace":
                if (isHighlighted($termBuffer)) {
                    $termBuffer = "";
                    break;
                }

                if (preBuffer.endsWith("&lt;"))
                    $termBuffer = preBuffer.slice(0, -4) + postBuffer;
                else if (preBuffer.endsWith("&gt;"))
                    $termBuffer = preBuffer.slice(0, -4) + postBuffer;
                else if (preBuffer.endsWith("&amp;"))
                    $termBuffer = preBuffer.slice(0, -5) + postBuffer;
                else if (preBuffer.endsWith("<br/>&nbsp;&nbsp;"))
                    $termBuffer = preBuffer.slice(0, -17) + postBuffer;
                else if (preBuffer.endsWith("&nbsp;"))
                    $termBuffer = preBuffer.slice(0, -6) + postBuffer;
                else if (preBuffer.endsWith("<br/>"))
                    $termBuffer = preBuffer.slice(0, -5) + postBuffer;
                else $termBuffer = preBuffer.slice(0, -1) + postBuffer;
                break;

            case "ArrowLeft":
                if (isHighlighted($termBuffer)) {
                    $termBuffer = toggleHighlight($termBuffer);
                    $termCursorPosition = $termBuffer.length;
                    break;
                }

                if (preBuffer.endsWith("&lt;")) $termCursorPosition += 4;
                else if (preBuffer.endsWith("&gt;")) $termCursorPosition += 4;
                else if (preBuffer.endsWith("&amp;")) $termCursorPosition += 5;
                else if (preBuffer.endsWith("<br/>&nbsp;&nbsp;"))
                    $termCursorPosition += 17;
                else if (preBuffer.endsWith("&nbsp;")) $termCursorPosition += 6;
                else if (preBuffer.endsWith("<br/>")) $termCursorPosition += 5;
                else $termCursorPosition += 1;
                break;

            case "ArrowRight":
                if (isHighlighted($termBuffer)) {
                    $termBuffer = toggleHighlight($termBuffer);
                    $termCursorPosition = 0;
                    break;
                }

                if (postBuffer.startsWith("&lt;")) $termCursorPosition -= 4;
                else if (postBuffer.startsWith("&gt;"))
                    $termCursorPosition -= 4;
                else if (postBuffer.startsWith("&amp;"))
                    $termCursorPosition -= 5;
                else if (postBuffer.startsWith("<br/>&nbsp;&nbsp;"))
                    $termCursorPosition -= 17;
                else if (postBuffer.startsWith("&nbsp;"))
                    $termCursorPosition -= 6;
                else if (postBuffer.startsWith("<br/>"))
                    $termCursorPosition -= 5;
                else $termCursorPosition -= 1;
                break;

            // TODO: ArrowDown & ArrowUp history

            case "KeyC":
                if (ev.ctrlKey) {
                    if (await maybeCopy($termBuffer)) {
                        $termBuffer = toggleHighlight($termBuffer);
                    } else {
                        if (isHighlighted($termBuffer))
                            $termBuffer = toggleHighlight($termBuffer);

                        $termContent +=
                            $termPrompt + $termBuffer + htmlText("^C\n");
                        $termBuffer = "";
                    }
                } else {
                    if (isHighlighted($termBuffer))
                        $termBuffer = toggleHighlight($termBuffer);

                    $termBuffer = preBuffer + htmlText(ev.key) + postBuffer;
                }

                break;

            case "KeyV":
                if (ev.ctrlKey) {
                    await requestClipboardPermission();
                    const text = await navigator.clipboard.readText();

                    if (isHighlighted($termBuffer)) {
                        $termBuffer = htmlText(text);
                    } else {
                        $termBuffer = preBuffer + htmlText(text) + postBuffer;
                    }
                } else {
                    if (isHighlighted($termBuffer))
                        $termBuffer = toggleHighlight($termBuffer);

                    $termBuffer = preBuffer + htmlText(ev.key) + postBuffer;
                }

                break;

            case "KeyA":
                if (ev.ctrlKey) {
                    ev.preventDefault();

                    if (!isHighlighted($termBuffer)) {
                        $termBuffer = toggleHighlight($termBuffer);
                        $termCursorPosition += HIGHLIGHT_END.length;
                        $termCursorPosition = Math.max(0, $termCursorPosition - HIGHLIGHT_START.length);
                    } else {
                        $termBuffer = preBuffer + htmlText(ev.key) + postBuffer;
                    }
                } else {
                    if (isHighlighted($termBuffer))
                        $termBuffer = toggleHighlight($termBuffer);

                    $termBuffer = preBuffer + htmlText(ev.key) + postBuffer;
                }

                break;

            case "ControlLeft":
            case "ShiftLeft":
            case "AltLeft":
            case "MetaLeft":
            case "ControlRight":
            case "ShiftRight":
            case "AltRight":
            case "MetaRight":
            case "ArrowUp":
            case "ArrowDown":
            case "Escape":
                break;

            case "Enter":
                if (isHighlighted($termBuffer))
                    $termBuffer = toggleHighlight($termBuffer);

                if (ev.shiftKey)
                    $termBuffer = preBuffer + htmlText("\n  ") + postBuffer;
                else execute();
                break;

            default:
                if (isHighlighted($termBuffer))
                    $termBuffer = toggleHighlight($termBuffer);

                $termBuffer = preBuffer + htmlText(ev.key) + postBuffer;
                break;
        }

        setTimeout(() => window.scrollTo({
            top: win.clientHeight + win.offsetTop,
            behavior: "smooth",
        }), 1);
    };

    const execute = () => {
        // $termContent += parseScript($termPrompt, $termBuffer);
        executeScript($termPrompt, $termBuffer);
        $termHistory.push($termBuffer);
        $termBuffer = "";

        setTimeout(() => window.scrollTo({
            top: win.clientHeight + win.offsetTop,
            behavior: "smooth",
        }), 1);
    };
</script>

<div bind:this={win}>
    {@html $termContent}
    {@html $termPrompt + preBuffer}<span
        class="animate-blink h-full border-l-1 border-r-1 border-white w-0 m-0 p-0"
    ></span>{@html postBuffer}
</div>

<style scoped>
    @keyframes blink {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    .animate-blink {
        animation: blink 1s steps(2, jump-none) infinite;
    }
</style>
