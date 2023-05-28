<script lang="ts">
    import pnpm from "../assets/pnpm.svg";
    import python from "../assets/python.svg";
    import tauri from "../assets/tauri.svg";
    import bun from "../assets/bun.svg";
    import wasm from "../assets/wasm.svg";
</script>

<svelte:head>
    <title>RedstoneWizard08</title>
</svelte:head>

<section class="hero">
    <p class="title">Jacob Sapoznikow</p>
    <p class="subtitle">Hobbyist, Web Designer, Game Developer</p>
</section>

<h2 class="section">Programming Languages (17)</h2>

<div class="programming-languages">
    <i class="devicon-html5-plain colored" />
    <i class="devicon-javascript-plain colored" />
    <i class="devicon-typescript-plain colored" />
    <i class="devicon-css3-plain colored" />
    <i class="devicon-java-plain-wordmark colored" />
    <i class="devicon-c-plain-wordmark colored" />
    <i class="devicon-cplusplus-plain colored" />
    <i class="devicon-csharp-plain colored" />
    <i class="devicon-bash-plain" />
    <i class="devicon-dotnetcore-plain colored" />
    <i class="devicon-go-original-wordmark colored" />
    <i class="devicon-markdown-original" />
    <i class="devicon-php-plain colored" />
    <i class="devicon-rust-plain" />
    <i class="devicon-sass-original colored" />
    <i class="devicon-kotlin-plain-wordmark colored" />
    <img src={python} alt="Python" />
</div>

<h2 class="section">Frameworks (9)</h2>

<div class="programming-languages">
    <i class="devicon-svelte-plain colored" />
    <i class="devicon-electron-original colored" />
    <i class="devicon-react-original colored" />
    <i class="devicon-nestjs-plain-wordmark colored" />
    <i class="devicon-nextjs-plain-wordmark" />
    <i class="devicon-adonisjs-original-wordmark colored" />
    <i class="devicon-nuxtjs-plain-wordmark colored" />
    <i class="devicon-vuejs-plain-wordmark colored" />
    <img src={tauri} alt="Tauri" />
</div>

<h2 class="section">Version Control Systems (3)</h2>

<div class="programming-languages">
    <i class="devicon-git-plain-wordmark colored" />
    <i class="devicon-github-original-wordmark" />
    <i class="devicon-gitlab-plain-wordmark colored" />
</div>

<h2 class="section">APIs, SDKs, and Compilers (16)</h2>

<div class="programming-languages">
    <i class="devicon-docker-plain colored" />
    <i class="devicon-socketio-original-wordmark" />
    <i class="devicon-express-original-wordmark" />
    <i class="devicon-tailwindcss-original-wordmark colored" />
    <i class="devicon-cmake-plain-wordmark colored" />
    <i class="devicon-gcc-plain colored" />
    <i class="devicon-gulp-plain colored" />
    <i class="devicon-nodejs-plain-wordmark colored" />
    <i class="devicon-npm-original-wordmark colored" />
    <i class="devicon-webpack-plain-wordmark colored" />
    <i class="devicon-yarn-plain-wordmark colored" />
    <i class="devicon-gradle-plain-wordmark colored" />
    <i class="devicon-denojs-plain-wordmark colored" />

    <img src={pnpm} alt="PNPM" />
    <img src={bun} alt="Bun.js" />
    <img src={wasm} alt="WebAssembly" />
</div>

<h2 class="section">Game Engines (4)</h2>

<div class="programming-languages">
    <i class="devicon-godot-plain-wordmark colored" />
    <i class="devicon-unity-original" />
    <i class="devicon-unrealengine-original" />
    <i class="devicon-threejs-original-wordmark" />
</div>

<h2 class="section">Tools (13)</h2>

<div class="programming-languages">
    <i class="devicon-debian-plain-wordmark colored" />
    <i class="devicon-figma-plain colored" />
    <i class="devicon-canva-plain colored" />
    <i class="devicon-filezilla-plain-wordmark colored" />
    <i class="devicon-firefox-plain colored" />
    <i class="devicon-jenkins-plain colored" />
    <i class="devicon-jira-plain-wordmark colored" />
    <i class="devicon-linux-plain" />
    <i class="devicon-mongodb-plain-wordmark colored" />
    <i class="devicon-mysql-plain-wordmark colored" />
    <i class="devicon-raspberrypi-line colored" />
    <i class="devicon-ubuntu-plain colored" />
    <i class="devicon-blender-original colored" />
</div>

<br />

<style lang="scss">
    .hero {
        width: calc(90% - 4rem);
        margin: 3% 5%;
        padding: 1rem 2rem;
        background-color: #2f3130;
        border-radius: 8px;
        height: 12rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .title {
            font-size: 24pt;
            margin: 1.5%;
        }

        .subtitle {
            font-size: 14pt;
            margin: 1.5%;
        }
    }

    .programming-languages {
        width: calc(90% - 3rem);
        margin: 3% 5%;
        padding: 1.5rem;
        background-color: #2f3130;
        border-radius: 8px;

        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
        grid-template-rows: auto;
        grid-column-gap: 8px;
        grid-row-gap: 16px;
        justify-items: center;
        align-items: center;

        i,
        img {
            font-size: 50pt;
            width: 70px;
        }

        @media screen and (max-width: 850px) {
            grid-template-columns: auto auto auto auto auto;
        }

        @media screen and (max-width: 450px) {
            grid-template-columns: auto auto auto auto;
        }
    }

    .section {
        margin-left: 10%;
    }
</style>
