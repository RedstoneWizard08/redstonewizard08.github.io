<template>
    <div class="container">
        <section id="project" class="section">
            <h2>Projects</h2>
            <div v-if="loading && !repos.length" class="spinner">Loading...</div>
            <div v-else>
                <div v-if="repos.length" class="repo-list">
                    <NuxtLink v-for="repo in repos" :key="repo.id" :to="`/project/${repo.name}`" class="portfolio-item">
                        <h3>{{ repo.name }}</h3>
                        <p>{{ repo.description }}</p>
                    </NuxtLink>
                </div>
                <div v-if="!allLoaded" ref="loadMoreTrigger" class="load-more-trigger">
                    <button @click="fetchRepos" class="load-more-button" :disabled="loading">
                        {{ loading ? "Loading..." : "Load More..." }}
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

useHead({
    title: "Projects | Redstone's Site",
});

interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string;
}

const repos = ref<Repo[]>([]);
const loading = ref(true);
const allLoaded = ref(false);
const page = ref(1);
const perPage = 100;
const loadMoreTrigger = ref(null);

const fetchRepos = async () => {
    try {
        loading.value = true;
        const response = await $fetch<Repo[]>(`https://api.github.com/users/RedstoneWizard08/repos`, {
            params: {
                sort: 'updated',
                direction: 'desc',
                per_page: perPage,
                page: page.value
            }
        });
        if (response.length > 0) {
            repos.value.push(...response);
            page.value += 1;
        }
        if (response.length < perPage) {
            allLoaded.value = true;
        }
    } catch (error) {
        console.error("Error fetching repos:", error);
    } finally {
        loading.value = false;
    }
};

const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !loading.value && !allLoaded.value) {
        await fetchRepos();
    }
};

let observer: IntersectionObserver;

onMounted(async () => {
    await fetchRepos();

    observer = new IntersectionObserver(handleIntersect);
    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
    }
});

onUnmounted(() => {
    if (observer && loadMoreTrigger.value) {
        observer.unobserve(loadMoreTrigger.value);
    }
});
</script>

<style scoped>
.container {
    font-family: Ubuntu;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

.section {
    margin-bottom: 2rem;
}

h2 {
    border-bottom: 2px solid var(--text-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    font-size: 2rem;
}

.spinner {
    text-align: center;
    margin: 2rem 0;
    font-size: 1.5rem;
    color: var(--text-color);
}

.repo-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.portfolio-item {
    display: block;
    background-color: var(--header-footer-bg-color);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 300px;
    transition: transform 0.2s, box-shadow 0.2s;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    text-decoration: none;
    color: inherit;
}

.portfolio-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.portfolio-item h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    color: var(--button-bg-color); /* Keep the label color */
}

.portfolio-item p {
    margin: 0;
    font-size: 1rem;
    color: var(--text-color);
}

.load-more-trigger {
    text-align: center;
    margin: 2rem 0;
    font-size: 1.25rem;
    color: var(--text-color);
}

.load-more-button {
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.load-more-button:hover:not(:disabled) {
    background-color: var(--button-hover-bg-color);
    color: var(--button-hover-text-color);
}

.load-more-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
