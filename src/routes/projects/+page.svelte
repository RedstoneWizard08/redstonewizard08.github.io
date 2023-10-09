<script lang="ts">
    import { base } from "$app/paths";
    import { Octokit } from "octokit";

    const getRepos = async () => {
        const client = new Octokit();

        const repos = await client.rest.repos.listForUser({
            username: "RedstoneWizard08",
            per_page: 999,
            sort: "pushed",
        });

        return repos;
    };

    let reposPromise = getRepos();
</script>

<svelte:head>
    <title>Projects | RedstoneWizard08</title>
</svelte:head>

<div class="projects">
    {#await reposPromise}
        Loading...
    {:then repos}
        {#each repos.data as repo}
            <a href={`${base}/projects/${repo.name}`} class="item">
                <div class="title">
                    <p>{repo.name}</p>

                    <div class="stars">
                        <i class="fa-solid fa-star" />
                        {repo.stargazers_count}
                    </div>
                </div>
                
                {#if repo.description}
                    <p class="text">{repo.description}</p>
                {/if}
            </a>
        {/each}
    {:catch err}
        Error: {err.message}
    {/await}
</div>

<style scoped lang="scss">
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

        .item {
            background-color: #1f2120;
            padding: 0.75rem 1.5rem;
            margin: 0.5rem;
            border-radius: 8px;
            color: #ffffff;
            text-decoration: none;
            width: calc(100% - 4rem);

            .title {
                font-size: 15pt;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }

            transition: background-color 0.5s ease;

            &:hover {
                background-color: #000000;
            }
        }
    }
</style>
