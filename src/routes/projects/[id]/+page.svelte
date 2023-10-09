<script lang="ts">
    import { page } from "$app/stores";
    import { Octokit } from "octokit";
    import { getIcon } from "../../../util/icons";
    import { Marked } from "marked";
    import { markedHighlight } from "marked-highlight";
    import axios from "axios";
    import hljs from "highlight.js";

    const getProject = async () => {
        const client = new Octokit();

        const project = await client.rest.repos.get({
            owner: "RedstoneWizard08",
            repo: $page.params.id,
        });

        return project;
    };

    const getLangs = async () => {
        const client = new Octokit();

        const languages = await client.rest.repos.listLanguages({
            owner: "RedstoneWizard08",
            repo: $page.params.id,
        });

        return languages;
    };

    const getReadme = async () => {
        const client = new Octokit();

        const readme = await client.rest.repos.getReadme({
            owner: "RedstoneWizard08",
            repo: $page.params.id,
        });

        const url = readme.data.download_url;

        return (await axios.get(url!)).data;
    };

    const renderMarkdown = (content: string) => {
        const marked = new Marked(
            markedHighlight({
                langPrefix: "hljs language-",
                highlight: (code, lang) => {
                    const language = hljs.getLanguage(lang) ? lang : "plaintext";
                    return hljs.highlight(code, { language }).value;
                },
            })
        );

        return marked.parse(content);
    };

    let projectPromise = getProject();
    let langsPromise = getLangs();
    let readmePromise = getReadme();
</script>

<svelte:head>
    {#await projectPromise}
        <title>Loading... | RedstoneWizard08</title>
    {:then project}
        <title>{project.data.name} | RedstoneWizard08</title>
    {:catch}
        <title>404 | RedstoneWizard08</title>
    {/await}
</svelte:head>

{#await projectPromise}
    <p>Loading...</p>
{:then project}
    <section class="project">
        <p class="name">
            <a class="back" href="/projects">
                <i class="fa-solid fa-arrow-left" />
            </a>

            {project.data.name}

            <a href={project.data.html_url} target="_blank" rel="noreferrer">
                <i class="devicon-github-original"></i>
            </a>
        </p>

        {#await langsPromise}
            {""}
        {:then langs}
            <div class="icons">
                {#each Object.keys(langs.data) as lang}
                    <i class={getIcon(lang.toLowerCase())} />
                {/each}
            </div>
        {/await}

        {#await readmePromise}
            <p class="text">Loading...</p>
        {:then readme}
            <p class="text">
                {@html renderMarkdown(readme)}
            </p>
        {:catch}
            <p class="text">{project.data.description}</p>
        {/await}
    </section>
{:catch}
    <div class="not-found">
        <p>Project not found!</p>

        <a href="/projects">
            <i class="fa-solid fa-arrow-left" />
            Back
        </a>
    </div>
{/await}

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

            transition:
                background-color 0.5s ease,
                color 0.5s ease;

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

        .text {
            margin: 0 1.5%;
        }

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

                transition:
                    background-color 0.5s ease,
                    color 0.5s ease;

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

            display: flex;
            flex-direction: row;
            justify-items: flex-start;
            align-items: center;

            i {
                font-size: 30pt;
                padding: 2px;
            }
        }
    }
</style>
