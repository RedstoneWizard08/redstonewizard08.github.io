<template>
    <div class="container">
        <div class="about-card">
            <p class="name">Jacob Sapoznikow</p>
            <p class="title">Hobbyist &bull; Web Designer &bull; Backend Programmer &bull; Game Developer</p>
        </div>

        <Technologies />
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import Technologies from "@/components/Technologies.vue";

const isDarkMode = inject("isDarkMode", ref(false));

useHead({
    title: "Home | Redstone's Site",
});
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.about-card {
    padding: 1.5rem;
    background-color: var(--card-background);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.name {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
}

.title {
    font-size: 1rem;
    color: var(--accent-color);
    margin-top: 0.5rem;
}

@media (max-width: 600px) {
    .container {
        padding: 1rem;
    }

    .name {
        font-size: 1.5rem;
    }

    .title {
        font-size: 0.875rem;
    }
}
</style>
