<script lang="ts">
    import { base } from "$app/paths";
    import { projects } from "../../util/projects";
</script>

<svelte:head>
    <title>Projects | RedstoneWizard08</title>
</svelte:head>

<div class="projects">
    {#each projects as project}
        <a href={`${base}/projects/${project.id}`} class="projects--item">
            <p class="projects--item--title">{project.name}</p>
            <p class="projects--item--text">{project.description}</p>
        </a>
    {/each}
</div>

<style lang="scss">
    .projects {
        width: calc(90% - 3rem);
        margin: 3% 5%;
        padding: 1.5rem;
        background-color: #2f3130;
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-evenly;

        &--item {
            background-color: #1f2120;
            padding: 0.75rem 1.5rem;
            margin: 0.5rem;
            border-radius: 8px;
            color: #ffffff;
            text-decoration: none;

            &--title {
                font-size: 15pt;
            }

            transition: background-color 0.5s ease;

            &:hover {
                background-color: #000000;
            }
        }
    }
</style>
