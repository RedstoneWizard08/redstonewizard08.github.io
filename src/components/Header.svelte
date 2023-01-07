<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { isMobileMenuOpen } from "../stores/headerInfo";

    let menuButton: HTMLDivElement;
    let menuBurger: HTMLDivElement;

    $: currentPath = $page.url.pathname;

    $: isHome = currentPath == `${base}/` || currentPath == base;
    $: isProjects = currentPath == `${base}/projects/` || currentPath == `${base}/projects`;
    $: isAbout = currentPath == `${base}/about/` || currentPath == `${base}/about`;
    $: isContact = currentPath == `${base}/contact/` || currentPath == `${base}/contact`;

    onMount(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) $isMobileMenuOpen = false;
        });

        window.addEventListener("click", (e) => {
            if (
                e.target != menuButton &&
                e.target != menuBurger &&
                $isMobileMenuOpen
            )
                $isMobileMenuOpen = false;
        });
    });

    const goToRoute = (route: string) => {
        goto(`${base}${route}`);
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="header">
    <a class="header--title" href="{base}/">RedstoneWizard08</a>

    <nav class="header--nav" class:open={$isMobileMenuOpen}>
        <ul class="header--pages">
            <li class="header--pages--page" class:current={isHome} on:click={() => goToRoute("/")}>
                <a href="{base}/">Home</a>
            </li>

            <li class="header--pages--page" class:current={isProjects} on:click={() => goToRoute("/projects")}>
                <a href="{base}/projects">Projects</a>
            </li>

            <li class="header--pages--page" class:current={isAbout} on:click={() => goToRoute("/about")}>
                <a href="{base}/about">About</a>
            </li>

            <li class="header--pages--page mobile-only" class:current={isContact} on:click={() => goToRoute("/contact")}>
                <a href="{base}/contact">Contact</a>
            </li>
        </ul>
    </nav>

    <div class="header--socials">
        <a
            href="https://github.com/RedstoneWizard08"
            target="_blank"
            rel="noreferrer"
            class="header--socials--link"><i class="fa-brands fa-github" /></a
        >

        <a
            href="mailto:redstonewizard08@nosadnile.net"
            target="_blank"
            rel="noreferrer"
            class="header--socials--link"><i class="fa-regular fa-envelope" /></a
        >
    </div>

    <a
        href="{base}/contact"
        class="header--contact-button"
        class:current={isContact}
        rel="noreferrer">Contact</a
    >

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="header--menu-button"
        class:open={$isMobileMenuOpen}
        on:click={() => ($isMobileMenuOpen = !$isMobileMenuOpen)}
        bind:this={menuButton}
    >
        <div class="header--menu-button--burger" bind:this={menuBurger} />
    </div>
</div>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/util";

    $burgerWidth: 35px;
    $burgerHeight: 4px;
    $burgerMargin: 8px;

    .header {
        width: 100%;
        height: 6rem;

        background-color: $headerBackground;
        color: $headerColor;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        &--contact-button {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            color: $buttonPrimaryColor;
            background-color: $buttonPrimaryBackground;
            border: none;

            padding: 0.5rem 1rem;
            font-size: 13pt;
            cursor: pointer;
            text-decoration: none;
            border-radius: 8px;

            margin-right: 2%;

            transition: color 0.5s ease, background-color 0.5s ease;

            &:hover {
                color: $buttonPrimaryColorHover;
                background-color: $buttonPrimaryBackgroundHover;
            }

            &.current {
                text-decoration: underline;
                text-underline-offset: 6px;
            }
        }

        &--title {
            font-family: "Share Tech Mono";
            font-size: 22pt;

            color: $headerColor;
            text-decoration: none;

            height: 96%;
            padding: 2%;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
        }

        &--menu-button {
            height: 96%;
            padding: 2%;
            cursor: pointer;
            transition: all 0.5s ease-in-out;
            border: none;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &--burger {
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

            &.open &--burger {
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

        &--socials {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            color: $headerColor;

            margin-right: 1rem;

            &--link {
                padding: 0.5rem;
                margin: 0.25rem;

                cursor: pointer;

                color: inherit;
                text-decoration: none;
            }
        }

        @media screen and (min-width: 849px) {
            &--menu-button {
                display: none;
                transition: none;

                &--burger {
                    &::before,
                    &::after {
                        visibility: hidden;
                        transition: none;
                    }
                }
            }

            &--nav {
                width: 100%;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            &--pages {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;

                width: 100%;

                &--page {
                    list-style: none;
                    font-size: 13pt;
                    padding: 0.5rem 1rem;
                    text-align: center;
                    cursor: pointer;
                    color: $navItemColor;

                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;

                    border-radius: 8px;
                    transition: background-color 0.5s ease;

                    a {
                        color: inherit;
                        text-decoration: none;
                        text-align: center;
                    }

                    &:hover {
                        background-color: $headerHover;
                    }

                    &.current {
                        text-decoration: underline;
                        text-underline-offset: 6px;
                    }
                }
            }
        }

        @media screen and (max-width: 850px) {
            &--contact-button {
                display: none !important;
            }

            &--title {
                margin-left: 2%;
            }

            &--menu-button {
                margin-right: 3%;
            }

            &--nav.open &--pages {
                opacity: 1;
            }

            &--pages {
                background: $headerBackground;
                padding-top: 0.5rem;

                display: flex;
                flex-direction: column;
                align-items: left;
                justify-content: center;

                opacity: 0;
                transition: opacity 0.5s ease;

                padding: 1rem;

                &--page {
                    list-style: none;
                    font-size: 18px;
                    width: 90%;

                    color: $headerColor;

                    &.current {
                        text-decoration: underline;
                        text-underline-offset: 6px;
                    }

                    a {
                        display: block;
                        color: inherit;
                        text-decoration: none;

                        padding: 0.7rem 1rem;
                        text-align: left;

                        width: calc(100% - 2rem);
                    }
                }
            }

            .header--pages {
                position: absolute;
                top: 3.2rem;
                left: 0;
                right: 0;
            }
        }
    }
</style>
