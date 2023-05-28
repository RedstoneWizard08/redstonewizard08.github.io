<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { isMenuOpen } from "../stores/headerInfo";

    let menuButton: HTMLDivElement;
    let menuBurger: HTMLDivElement;
    let menu: HTMLDivElement;

    $: currentPath = $page.url.pathname;

    $: isHome = currentPath == `${base}/` || currentPath == base;
    $: isProjects = currentPath == `${base}/projects/` || currentPath == `${base}/projects`;
    $: isAbout = currentPath == `${base}/about/` || currentPath == `${base}/about`;
    $: isContact = currentPath == `${base}/contact/` || currentPath == `${base}/contact`;

    onMount(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) $isMenuOpen = false;
        });

        window.addEventListener("click", (e) => {
            if (e.target != menuButton && e.target != menuBurger && e.target != menu && $isMenuOpen)
                $isMenuOpen = false;
        }, false);
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="header">
    <a class="title" href="{base}/">RedstoneWizard08</a>

    <div class="pages" class:open={$isMenuOpen} bind:this={menu}>
        <a href="{base}/" class="page" class:current={isHome}>Home</a>
        <a href="{base}/projects" class="page" class:current={isProjects}>Projects</a>
        <a href="{base}/about" class="page" class:current={isAbout}>About</a>
        <a href="{base}/contact" class="page" class:current={isContact}>Contact</a>
    </div>

    <div class="socials">
        <a
            href="https://github.com/RedstoneWizard08"
            target="_blank"
            rel="noreferrer"
            class="social"><i class="fa-brands fa-github" /></a
        >

        <a
            href="mailto:redstonewizard08@nosadnile.net"
            target="_blank"
            rel="noreferrer"
            class="social"><i class="fa-regular fa-envelope" /></a
        >
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="menu-button"
        class:open={$isMenuOpen}
        on:click={() => ($isMenuOpen = !$isMenuOpen)}
        bind:this={menuButton}
    >
        <div class="burger" bind:this={menuBurger} />
    </div>
</div>

<style lang="scss">
    @use "../styles/variables";

    $burgerWidth: 30px;
    $burgerHeight: 2px;
    $burgerMargin: 8px;

    .header {
        width: 100%;
        height: 6rem;

        background-color: variables.$headerBackground;
        color: variables.$headerColor;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .title {
            font-family: "Share Tech Mono";
            font-size: 22pt;

            color: variables.$headerColor;
            text-decoration: none;

            height: 96%;
            padding: 2%;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            @media screen and (max-width: 850px) {
                margin-left: 2%;
            }
        }

        .pages {
            width: calc(24% - 1rem);
            height: calc(100% - 1rem);
            padding: 0.5rem calc(0.5% + 0.5rem);

            position: fixed;
            top: 0;
            left: 0;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            background-color: variables.$headerBackground;
            border-right: 1px solid variables.$menuBorder;
            
            opacity: 0;
            transform: translateX(-100%);
            transform-origin: left;
            pointer-events: none;

            transition: opacity 0.5s ease, transform 0.5s ease;

            @media screen and (max-width: 850px) {
                width: calc(74% - 1rem);
            }

            &.open {
                opacity: 1;
                transform: translateX(0);
                pointer-events: unset;
            }

            .page {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;

                padding: 0.4rem 0.5rem;
                margin: 0.5rem 0;

                background-color: variables.$buttonBackground;
                color: variables.$buttonColor;
                border-radius: 8px;
                border: 1px solid variables.$buttonBorderColor;

                text-decoration: none;
                font-family: "Montserrat";
                font-size: 14pt;

                transition: background-color 0.5s ease, color 0.5s ease;

                &.current {
                    background-color: variables.$buttonBackgroundHover;
                    color: variables.$buttonColorHover;

                    &:hover {
                        background-color: variables.$buttonBackground;
                        color: variables.$buttonColor;
                    }
                }

                &:hover {
                    background-color: variables.$buttonBackgroundHover;
                    color: variables.$buttonColorHover;
                }
            }
        }

        .menu-button {
            padding: 1% 0;
            margin: 1% 2%;
            cursor: pointer;
            transition: all 0.5s ease-in-out;
            border: none;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            @media screen and (max-width: 850px) {
                margin-right: 6%;
            }

            .burger {
                width: $burgerWidth;
                height: $burgerHeight;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(255, 101, 47, 0.2);
                transition: all 0.5s ease-in-out;

                &::before,
                &::after {
                    content: "";
                    position: absolute;
                    width: $burgerWidth;
                    height: $burgerHeight;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(255, 101, 47, 0.2);
                    transition: all 0.5s ease-in-out;
                }

                &::before {
                    transform: translateY(-$burgerHeight - $burgerMargin);
                }

                &::after {
                    transform: translateY($burgerHeight + $burgerMargin);
                }
            }

            &.open .burger {
                background: transparent;
                box-shadow: none;

                &::before {
                    transform: rotate(45deg);
                }

                &::after {
                    transform: rotate(-45deg);
                }
            }
        }

        .socials {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            color: variables.$headerColor;

            margin-left: auto;
            margin-right: 0.25rem;

            .social {
                padding: 0.5rem;
                margin: 0.5rem;
                cursor: pointer;
                color: inherit;
                text-decoration: none;

                @media screen and (max-width: 850px) {
                    margin: 0.125rem;
                }
            }
        }
    }
</style>
