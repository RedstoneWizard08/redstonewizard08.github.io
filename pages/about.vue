<template>
    <div class="container">
        <img src="/me.webp" class="icon" alt="Profile Picture" />
        <h3 class="title">Jacob Sapoznikow</h3>
        <h5 class="pronouns">he/him</h5>
        <h4 class="email">
            <a href="mailto:jacob@nosadnile.net">jacob@nosadnile.net</a>
        </h4>
        <h4 class="github">
            <a href="https://github.com/RedstoneWizard08">@RedstoneWizard08</a>
        </h4>

        <p class="about">
            Hi! My name is Jacob Sapoznikow, and I am a budding software
            engineer and game developer. I am 15 years old, and I have been
            coding for almost eight years. I can code with a lot of languages,
            frameworks, APIs, and SDKs, and I always love a good challenge. I am
            a proud Rustacean, and I make full-stack apps with Rust and
            TypeScript. My favorite frontend framework is SvelteKit, but I also
            love using Nuxt and Next.js as well. If you ever need to contact me, you can
            send me an email using the address jacob@nosadnile.net (once the
            mail server is back up), and I'll try to respond as quickly as I
            can. See ya!
        </p>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "About | Redstone's Site",
});
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.icon {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 2rem;
    margin: 0.5rem 0;
}

.pronouns {
    font-size: 1.2rem;
    color: white;
    margin: 0.25rem 0;
}

.email, .github {
    font-size: 1rem;
    margin: 0.5rem 0;
}

.email a, .github a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.2s;
}

.email a:hover, .github a:hover {
    color: #2980b9;
    text-decoration: underline;
}

.about {
    font-size: 1rem;
    text-align: justify;
    line-height: 1.6;
    margin-top: 1rem;
}

@media (max-width: 600px) {
    .container {
        padding: 1rem;
    }

    .title {
        font-size: 1.5rem;
    }

    .pronouns {
        font-size: 1rem;
    }

    .email, .github {
        font-size: 0.875rem;
    }

    .about {
        font-size: 0.875rem;
    }
}
</style>
