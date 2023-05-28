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
            <p class="name">
                <a class="back" href="/projects">
                    <i class="fa-solid fa-arrow-left" />
                </a>

                {project?.name}
                
                {#if repo}
                    <a href={repo} target="_blank" rel="noreferrer">
                        <i class="devicon-github-original"></i>
                    </a>
                {/if}
            </p>
            
            <div class="icons">
                {#each stack as icon}
                    <i class={icon} />
                {/each}
            </div>
        
            <p class="text">{project?.description}</p>
        </section>
    {:else}
        <p>Loading...</p>
    {/if}
{:else}
    <div class="not-found">
        <p>Project not found!</p>

        <a href="/projects">
            <i class="fa-solid fa-arrow-left" />
            Back
        </a>
    </div>
{/if}

<style lang="scss">
    .not-found {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p {
            font-size: 16pt;
            margin-bottom: 2rem;
        }

        a {
            font-size: 16pt;
            color: #ffffff;
            text-decoration: none;
            border: 1px solid #ffffff;
            border-radius: 8px;
            padding: 0.5rem 1rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            transition: background-color 0.5s ease, color 0.5s ease;

            i {
                margin-right: 0.5rem;
            }

            &:hover {
                background-color: #ffffff;
                color: #000000;
            }
        }
    }

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

        .name {
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
                margin-left: 4%;

                @media screen and (min-width: 850px) {
                    margin-left: 2%;
                }
            }

            .back {
                margin-left: 2%;
                margin-right: 4%;

                border: 1px solid #ffffff;
                border-radius: 8px;
                padding: 0.5rem 0.75rem;

                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                transition: background-color 0.5s ease, color 0.5s ease;

                i {
                    font-size: 16pt;
                }

                &:hover {
                    background-color: #ffffff;
                    color: #000000;
                }

                @media screen and (min-width: 850px) {
                    margin-left: 1%;
                    margin-right: 2%;
                }
            }
        }

        .icons {
            width: calc(98% - 2rem);
            margin: 1%;
            padding: 1rem;
            background-color: #1f2120;
            border-radius: 8px;

            display: grid;
            grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
            grid-template-rows: auto;
            grid-column-gap: 8px;
            grid-row-gap: 16px;
            justify-items: center;
            align-items: center;

            i {
                font-size: 30pt;
                width: 70px;
            }

            @media screen and (max-width: 850px) {
                grid-template-columns: auto auto auto auto auto;
            }

            @media screen and (max-width: 450px) {
                grid-template-columns: auto auto auto auto;
            }
        }
    }
</style>
