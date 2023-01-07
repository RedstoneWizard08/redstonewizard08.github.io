<script lang="ts">
    import { page } from "$app/stores";
    import { projects, resolveRepo } from "../../../util/projects";
    import { getIcons } from "../../../util/icons";

    $: route = $page.params.id;
    $: project = projects.find((p) => p.id == route);
    $: isFound = !(project == undefined);
    $: stack = project ? getIcons(project.stack) : [];
    $: repo = resolveRepo(project);

    $: ready = true;
</script>

<svelte:head>
    {#if isFound}
        <title>{project?.name} | RedstoneWizard08</title>
    {:else}
        <title>404 | RedstoneWizard08</title>
    {/if}
</svelte:head>

{#if isFound}
    {#if ready}
        <section class="project">
            <p class="project--name">
                {project?.name}
                
                {#if repo}
                    <a href={repo} target="_blank" rel="noreferrer">
                        <i class="devicon-github-original"></i>
                    </a>
                {/if}
            </p>
            
            <div class="project--icons">
                {#each stack as icon}
                    <i class={icon} />
                {/each}
            </div>
        
            <p class="project--text">{project?.description}</p>
        </section>
    {:else}
        <p>Loading...</p>
    {/if}
{:else}
    <p>Project not found!</p>
{/if}

<style lang="scss">
    .project {
        width: calc(90% - 3rem);
        margin: 3% 5%;
        padding: 0.5rem 1.5rem;
        background-color: #2f3130;
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-evenly;

        &--name {
            color: #ffffff;
            font-size: 20pt;
            width: 100%;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            a {
                color: inherit;
                text-decoration: none;
                margin-left: 1%;
            }
        }

        &--icons {
            background-color: #1f2120;
            padding: 1%;
            border-radius: 8px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            i {
                font-size: 30pt;
                width: 70px;
                margin: 3%;
            }
        }
    }
</style>
