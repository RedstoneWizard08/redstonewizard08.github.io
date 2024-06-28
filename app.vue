<!-- <template>
    <div>
        <NuxtRouteAnnouncer />
    </div>
</template> -->

<template>
    <NuxtLayout>
        <v-app>
            <NuxtPage />
        </v-app>
    </NuxtLayout>
</template>

<style>
:root {
    --background-color: #f4f4f4;
    --text-color: #333;
    --header-footer-bg-color: #444;
    --nav-bg-color: #555;
    --button-bg-color: #333;
    --button-text-color: #fff;
}

.dark {
    --background-color: #1a1a1a;
    --text-color: #f4f4f4;
    --header-footer-bg-color: #000;
    --nav-bg-color: #111;
    --button-bg-color: #444;
    --button-text-color: #fff;
}

html,
body {
    font-family: Arial, sans-serif;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background-color: var(--background-color);
    color: var(--text-color);
}

.container {
    height: 100%;
}
</style>
