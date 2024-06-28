<template>
    <div class="technologies">
        <h2>Technologies I Use</h2>

        <div class="tech-list">
            <div v-for="tech in technologies" :key="tech.name" class="tech-item">
                <a :href="tech.url" target="_blank">
                    <img :src="(!tech.dark || !isDarkMode) ? tech.icon : tech.dark" :alt="tech.name" class="tech-icon" />
                    <span>{{ tech.name }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isDarkMode = inject("isDarkMode", ref(false));

const technologies = [
    { name: "Rust", url: "https://www.rust-lang.org/", icon: "https://raw.githubusercontent.com/rust-lang/rust-artwork/master/logo/rust-logo-128x128.png" },
    { name: "TypeScript", url: "https://www.typescriptlang.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg" },
    { name: "Vue.js", url: "https://vuejs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "React", url: "https://reactjs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Svelte", url: "https://svelte.dev/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
    { name: "Solid", url: "https://solidjs.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidjs/solidjs-original.svg" },
    { name: "Java", url: "https://www.java.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Kotlin", url: "https://kotlinlang.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
    { name: "Python", url: "https://www.python.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Bash", url: "https://www.gnu.org/software/bash/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
    { name: "JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "C", url: "https://en.wikipedia.org/wiki/C_(programming_language)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
    { name: "C++", url: "https://isocpp.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "C#", url: "https://docs.microsoft.com/en-us/dotnet/csharp/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
    { name: "HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "PHP", url: "https://www.php.net/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { name: "Sass", url: "https://sass-lang.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
    { name: "Markdown", url: "https://www.markdownguide.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg", dark: "/logos/markdown.svg" },
    { name: ".NET", url: "https://dotnet.microsoft.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" },
    { name: "Electron", url: "https://www.electronjs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" },
    { name: "Tauri", url: "https://tauri.app/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tauri/tauri-original.svg" },
    { name: "Next.js", url: "https://nextjs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "Nuxt.js", url: "https://nuxtjs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
    { name: "Git", url: "https://git-scm.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", url: "https://github.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", dark: "/logos/github.svg" },
    { name: "GitLab", url: "https://about.gitlab.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
    { name: "Docker", url: "https://www.docker.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "NodeJS", url: "https://nodejs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Bun", url: "https://bun.sh/", icon: "https://bun.sh/logo.png" },
    { name: "WebAssembly", url: "https://webassembly.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wasm/wasm-original.svg" },
    { name: "PNPM", url: "https://pnpm.io/", icon: "https://pnpm.io/img/pnpm-no-name-with-frame.svg" },
    { name: "NPM", url: "https://www.npmjs.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
    { name: "Yarn", url: "https://yarnpkg.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg" },
    { name: "Webpack", url: "https://webpack.js.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
    { name: "Gradle", url: "https://gradle.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-original.svg" },
    { name: "GCC", url: "https://gcc.gnu.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gcc/gcc-original.svg" },
    { name: "CMake", url: "https://cmake.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg" },
    { name: "Tailwind", url: "https://tailwindcss.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Three.js", url: "https://threejs.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg", dark: "/logos/three.svg" },
    { name: "Unity", url: "https://unity.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" },
    { name: "Unreal", url: "https://www.unrealengine.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg", dark: "/logos/unrealengine.svg" },
    { name: "Godot", url: "https://godotengine.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg" },
    { name: "Debian", url: "https://www.debian.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg" },
    { name: "Figma", url: "https://www.figma.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Jenkins", url: "https://www.jenkins.io/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
    { name: "Jira", url: "https://www.atlassian.com/software/jira", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
    { name: "Linux", url: "https://www.linux.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    { name: "MongoDB", url: "https://www.mongodb.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "MySQL", url: "https://www.mysql.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "PostgreSQL", url: "https://www.postgresql.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Ubuntu", url: "https://ubuntu.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg" },
    { name: "Blender", url: "https://www.blender.org/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
];
</script>

<style scoped lang="scss">
.technologies {
    margin: 2rem 0;
    text-align: center;

    h2 {
        margin: 1.5rem;
        font-family: Ubuntu;
    }
}

.tech-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
}

.tech-item {
    width: 100px;
    height: calc(100px + 0.75rem);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;

    a {
        text-decoration: none;
    }
}

.tech-icon {
    width: 70px;
    height: 70px;
    object-fit: contain;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tech-item span {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
    color: white;
    text-decoration: none;
}
</style>
