<script lang="ts">
    import RedstoneWizard08 from "../../assets/me.png";
</script>

<svelte:head>
    <title>About | RedstoneWizard08</title>
</svelte:head>

<div class="about">
    <img src={RedstoneWizard08} alt="RedstoneWizard08" class="image" />

    <div class="content">
        <p class="title">Jacob Sapoznikow (he/him/his)</p>

        <div class="links">
            <a href="mailto:redstonewizard08@nosadnile.net" rel="noreferrer" target="_blank"
                >Email</a
            >
            {" "}|{" "}
            <a href="https://github.com/RedstoneWizard08" rel="noreferrer" target="_blank"
                >@RedstoneWizard08</a
            >
        </div>

        <hr class="divider" />

        <p class="paragraph">
            Hi! My name is Jacob Sapoznikow, and I am a budding software engineer and game
            developer. I am 14 years old, and I have been coding for more than eight years.
            I can code in a lot of languages, frameworks, APIs, and SDKs, and I always love
            a good challenge.
            <br /><br />
            I am a proud Rustacean, and I make full-stack apps with Rust and TypeScript. My favorite
            frontend framework is SvelteKit, but I also love trying new ones, too.
            <br /><br />
            If you ever need to contact me, you can send me an email using the address above (once the
            mail server is back up). See ya!
        </p>
    </div>
</div>

<style lang="scss">
    .about {
        width: calc(100% - 4rem);
        height: calc(100% - 10rem);
        padding: 2rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .image {
            width: 14rem;
            margin-right: 1.25rem;
        }

        .content {
            margin: 0 1.25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 24rem;

            .title {
                font-size: 16pt;
                margin-top: 0;
                margin-bottom: 2%;
                font-family: "Montserrat";
            }

            .links {
                margin-bottom: 4%;

                a {
                    color: inherit;
                    text-underline-offset: 4px;
                    font-size: 10pt;
                    font-family: "Montserrat";
                    margin-top: 2%;
                }
            }

            .divider {
                width: 100%;
                height: 1px;
                background-color: rgba(0, 0, 0, 0.6);
            }
        }
    }

    @media screen and (max-width: 850px) {
        .about {
            flex-direction: column;
            height: auto;

            .image {
                width: 100%;
                margin-bottom: 6%;
            }
        }
    }
</style>
