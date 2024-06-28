<template>
    <v-app>
        <v-main>
            <div class="container">
                <section id="repo-details" class="section">
                    <div class="header">
                        <h2>
                            <a :href="repo?.html_url" target="_blank">{{ repo?.name }}</a>
                            <span v-if="license" class="license-tag">{{ license }}</span>
                        </h2>
                        <div class="stats">
                            <span v-if="repo?.stargazers_count" class="stat">
                                <i class="fas fa-star"></i> {{ repo.stargazers_count }} Stars
                            </span>
                            <span v-if="repo?.watchers_count" class="stat">
                                <i class="fas fa-eye"></i> {{ repo.watchers_count }} Watchers
                            </span>
                            <span v-if="repo?.forks_count" class="stat">
                                <i class="fas fa-code-branch"></i> {{ repo.forks_count }} Forks
                            </span>
                            <span v-if="repo?.open_issues_count" class="stat">
                                <i class="fas fa-exclamation-circle"></i> {{ repo.open_issues_count }} Open Issues
                            </span>
                        </div>
                        <div v-if="languages" class="language-bar">
                            <v-tooltip
                                v-for="(value, key) in languagePercentages"
                                :key="key"
                                location="bottom"
                                :text="`${key}: ${formatNumber(languages[key])} lines`"
                            >
                                <template v-slot:activator="{ props }">
                                    <div
                                        v-bind="props"
                                        class="language-segment"
                                        :style="{
                                            width: value + '%',
                                            backgroundColor:
                                                languageColors[key],
                                        }"
                                    ></div>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                    <div v-if="loading" class="spinner">Loading...</div>
                    <div v-else>
                        <div v-if="readme" class="readme" v-html="readme"></div>
                    </div>
                </section>
            </div>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { markedEmoji } from "marked-emoji";
import DOMPurify from "dompurify";
import { Octokit } from "@octokit/rest";
import type { Repo, Languages, ColorsJson } from "@/api/repo";

useHead({
    title: "Loading... | Redstone's Site",
});

const route = useRoute();
const repoName = route.params.name;

const repo = ref<Repo | null>(null);
const readme = ref<string | null>(null);
const license = ref<string | null>(null);
const languages = ref<Languages | null>(null);
const loading = ref(true);
const colorsJson = ref<ColorsJson | null>(null);

const fetchColors = async () => {
    const response = await fetch(
        "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
    );
    if (response.ok) {
        colorsJson.value = await response.json();
    } else {
        console.error("Failed to fetch colors.json");
    }
};

const fetchEmojis = async () => {
    return markedEmoji({
        emojis: (await new Octokit().rest.emojis.get()).data,
        renderer: (token) => `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img">`,
    });
};

const fetchRepoDetails = async () => {
    try {
        // Fetch Repo
        repo.value = await $fetch<Repo>(
            `https://api.github.com/repos/RedstoneWizard08/${repoName}`
        );

        // Fetch README
        const readmeResponse = await fetch(
            `https://api.github.com/repos/RedstoneWizard08/${repoName}/readme`
        );

        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            const readmeContent = atob(readmeData.content);

            readme.value = DOMPurify.sanitize(await marked(readmeContent));
        }

        // Fetch License
        if (repo.value.license) {
            license.value = repo.value.license.spdx_id;
        }

        // Fetch Languages
        languages.value = await $fetch<Languages>(
            `https://api.github.com/repos/RedstoneWizard08/${repoName}/languages`
        );
    } catch (error) {
        console.error("Error fetching repo details:", error);
    } finally {
        loading.value = false;

        useHead({
            title: `${repo.value?.name} | Redstone's Site`,
        });
    }
};

const languagePercentages = computed(() => {
    if (!languages.value) return {};

    const total = Object.values(languages.value).reduce(
        (acc, value) => acc + value,
        0
    );
    return Object.fromEntries(
        Object.entries(languages.value).map(([key, value]) => [
            key,
            ((value / total) * 100).toFixed(2),
        ])
    );
});

const languageColors = computed(() => {
    if (!colorsJson.value) return {};
    return Object.fromEntries(
        Object.entries(languages.value || {}).map(([key]) => [
            key,
            colorsJson.value![key]?.color || "#000000",
        ])
    );
});

const formatNumber = (num: number) => {
    const units = ["", "k", "m", "b", "t"];
    let unitIndex = 0;

    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }

    return num.toFixed(!(num % 10) ? 0 : 1) + units[unitIndex];
};

onMounted(async () => {
    marked.use(await fetchEmojis());

    fetchColors();
    fetchRepoDetails();
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

.container {
    padding: 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

.section {
    margin-bottom: 2rem;
}

.header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

h2 {
    display: flex;
    align-items: center;
    border-bottom: 2px solid var(--text-color);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 2rem;
}

h2 a {
    color: var(--text-color);
    text-decoration: none;
    margin-right: 0.5rem;
}

h2 a:hover {
    text-decoration: underline;
}

.license-tag {
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    margin-left: 0.5rem;
}

.stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.stat {
    background-color: var(--header-footer-bg-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.spinner {
    text-align: center;
    margin: 2rem 0;
    font-size: 1.5rem;
    color: var(--text-color);
}

.readme {
    margin-top: 1.5rem;
    background-color: var(--header-footer-bg-color);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.language-bar {
    display: flex;
    height: 10px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
    width: 100%;
}

.language-segment {
    height: 100%;
    position: relative;
}
</style>

<style lang="scss">
h1, h2, h3, h4, h5, h6 {
    margin: 0.75rem 0;

    &:first-child {
        margin-top: 0;
    }
}

ul, ol {
    margin-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.2s;
}

a:hover {
    color: #2980b9;
    text-decoration: underline;
}
</style>
