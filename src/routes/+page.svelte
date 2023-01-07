<script lang="ts">
    import pnpm from "../assets/pnpm.svg";
</script>

<svelte:head>
    <title>RedstoneWizard08</title>
</svelte:head>

<section class="hero">
    <p class="hero--title">Jacob Sapoznikow</p>
    <p class="hero--subtitle">Hobbyist, Web Designer, Game Developer</p>
</section>

<h2 class="section">Programming Languages (15)</h2>

<div class="programming-languages">
    <i class="devicon-html5-plain colored"></i>
    <i class="devicon-javascript-plain colored"></i>
    <i class="devicon-typescript-plain colored"></i>
    <i class="devicon-css3-plain colored"></i>
    <i class="devicon-java-plain-wordmark colored"></i>
    <i class="devicon-c-plain-wordmark colored"></i>
    <i class="devicon-cplusplus-plain colored"></i>
    <i class="devicon-csharp-plain colored"></i>
    <i class="devicon-bash-plain"></i>
    <i class="devicon-dotnetcore-plain colored"></i>
    <i class="devicon-go-original-wordmark colored"></i>
    <i class="devicon-markdown-original"></i>
    <i class="devicon-php-plain colored"></i>
    <i class="devicon-rust-plain"></i>
    <i class="devicon-sass-original colored"></i>
</div>

<h2 class="section">Frameworks (6)</h2>

<div class="programming-languages">
    <i class="devicon-svelte-plain colored"></i>
    <i class="devicon-electron-original colored"></i>
    <i class="devicon-react-original colored"></i>
    <i class="devicon-nestjs-plain-wordmark colored"></i>
    <i class="devicon-nextjs-plain-wordmark"></i>
    <i class="devicon-adonisjs-original-wordmark colored"></i>
</div>

<h2 class="section">Version Control Systems (3)</h2>

<div class="programming-languages">
    <i class="devicon-git-plain-wordmark colored"></i>
    <i class="devicon-github-original-wordmark"></i>
    <i class="devicon-gitlab-plain-wordmark colored"></i>
</div>

<h2 class="section">APIs, SDKs, and Compilers (12)</h2>

<div class="programming-languages">
    <i class="devicon-docker-plain colored"></i>
    <i class="devicon-socketio-original-wordmark"></i>
    <i class="devicon-express-original-wordmark"></i>
    <i class="devicon-tailwindcss-original-wordmark colored"></i>
    <i class="devicon-cmake-plain-wordmark colored"></i>
    <i class="devicon-gcc-plain colored"></i>
    <i class="devicon-gulp-plain colored"></i>
    <i class="devicon-nodejs-plain-wordmark colored"></i>
    <i class="devicon-npm-original-wordmark colored"></i>
    <i class="devicon-webpack-plain-wordmark colored"></i>
    <i class="devicon-yarn-plain-wordmark colored"></i>
    <img src={pnpm} alt="PNPM logo" />
</div>

<h2 class="section">Game Engines (4)</h2>

<div class="programming-languages">
    <i class="devicon-godot-plain-wordmark colored"></i>
    <i class="devicon-unity-original"></i>
    <i class="devicon-unrealengine-original"></i>
    <i class="devicon-threejs-original-wordmark"></i>
</div>

<h2 class="section">Tools (13)</h2>

<div class="programming-languages">
    <i class="devicon-debian-plain-wordmark colored"></i>
    <i class="devicon-figma-plain colored"></i>
    <i class="devicon-canva-plain colored"></i>
    <i class="devicon-filezilla-plain-wordmark colored"></i>
    <i class="devicon-firefox-plain colored"></i>
    <i class="devicon-jenkins-plain colored"></i>
    <i class="devicon-jira-plain-wordmark colored"></i>
    <i class="devicon-linux-plain"></i>
    <i class="devicon-mongodb-plain-wordmark colored"></i>
    <i class="devicon-mysql-plain-wordmark colored"></i>
    <i class="devicon-raspberrypi-line colored"></i>
    <i class="devicon-ubuntu-plain colored"></i>
    <i class="devicon-blender-original colored"></i>
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

        &--title {
            font-size: 24pt;
            margin: 1.5%;
        }

        &--subtitle {
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
        grid-template-columns: auto auto auto auto auto auto
            auto auto auto auto auto auto auto auto auto auto;
        
        grid-template-rows: auto;
        grid-column-gap: 8px;
        justify-items: center;
        align-items: center;

        i, img {
            font-size: 50pt;
            width: 70px;
        }
    }

    .section {
        margin-left: 10%;
    }

    @media screen and (max-width: 850px) {
        .programming-languages {
            grid-template-columns: auto auto auto auto auto;
        }
    }
</style>
