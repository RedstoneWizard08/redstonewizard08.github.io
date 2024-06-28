<template>
    <div :class="{ dark: isDarkMode }" class="layout">
        <nav>
            <div class="nav-left">
                <span class="brand"><NuxtLink href="/">RedstoneWizard08</NuxtLink></span>
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/about">About</NuxtLink>
                <NuxtLink to="/projects">Projects</NuxtLink>
                <NuxtLink to="/blog">Blog</NuxtLink>
            </div>
            <div class="nav-right">
                <button @click="toggleDarkMode" class="dark-mode-toggle">
                    <i class="fa-solid fa-moon" v-if="isDarkMode" />
                    <i class="fa-solid fa-sun" v-if="!isDarkMode" />
                </button>
                <a href="https://www.youtube.com/c/RedstoneWizard08" class="social-icon" target="_blank" aria-label="YouTube">
                    <i class="fa-brands fa-youtube" />
                </a>
                <a href="https://www.twitch.tv/RedstoneWizard08" class="social-icon" target="_blank" aria-label="Twitch">
                    <i class="fa-brands fa-twitch" />
                </a>
                <a href="https://github.com/RedstoneWizard08" class="social-icon" target="_blank" aria-label="GitHub">
                    <i class="fa-brands fa-github" />
                </a>
            </div>
        </nav>
        <main>
            <NuxtPage />
        </main>
        <footer>
            <p>&copy; 2024 RedstoneWizard08</p>
        </footer>
        <div class="easter-egg" v-if="easterEggVisible">
            <p>You've found an Easter egg! 🎉</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue";

const easterEggVisible = ref(false);
const isDarkMode = ref(true);

const handleKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key === "e") {
        easterEggVisible.value = true;
    }
};

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle("dark", isDarkMode.value);
};

provide("isDarkMode", isDarkMode);

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
    document.documentElement.classList.add("dark");
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
body {
    font-family: Ubuntu;
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

:root {
    --background-color: #121212;
    --text-color: #e0e0e0;
    --header-footer-bg-color: #1f1f1f;
    --nav-bg-color: #212121;
    --button-bg-color: #03dac6;
    --button-text-color: #000000;
}

.dark {
    --background-color: #121212;
    --text-color: #e0e0e0;
    --header-footer-bg-color: #1f1f1f;
    --nav-bg-color: #212121;
    --button-bg-color: #03dac6;
    --button-text-color: #000000;
}

nav {
    background-color: var(--nav-bg-color);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-left {
    display: flex;
    align-items: center;
}

.brand, .brand a {
    color: var(--text-color);
    font-size: 1.5rem;
    font-weight: 700;
    margin-right: 0.5rem;
}

nav a {
    color: var(--text-color);
    margin: 0 0.75rem;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;
}

nav a:hover {
    color: var(--button-bg-color);
}

.nav-right {
    display: flex;
    align-items: center;
}

button.dark-mode-toggle {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 1.5rem;
    margin: 0 0.75rem;
    cursor: pointer;
    transition: color 0.3s;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

button.dark-mode-toggle:hover {
    color: var(--button-bg-color);
}

.social-icon {
    margin: 0 0.75rem;
    font-size: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

main {
    flex: 1;
    padding: 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

footer {
    background-color: var(--header-footer-bg-color);
    color: var(--text-color);
    padding: 1rem;
    text-align: center;
    border-top: 1px solid var(--nav-bg-color);
    margin-top: auto;
}

.easter-egg {
    background-color: var(--text-color);
    border: 2px solid var(--header-footer-bg-color);
    padding: 1rem;
    margin: 2rem;
    text-align: center;
    font-size: 1.5rem;
}
</style>
