import { get } from "svelte/store";
import { gid, uid } from "./env";
import { vfs } from "./vfs.ts";
import { Octokit } from "octokit";
import { logInit, logInitPre } from "./init.ts";

const gh = new Octokit();

export const generateFilesystem = async () => {
    const curUid = get(uid);
    const curGid = get(gid);

    uid.set(-1);
    gid.set(-1);

    vfs.mkdirs("/home/web-user/projects");

    const repos = [
        "RedstoneWizard08/NeoInstall",
        "RedstoneWizard08/Wormhole",
        "RedstoneWizard08/ModHost",
        "RedstoneWizard08/QuickScript",
        "RedstoneWizard08/mayhem",
        "RedstoneWizard08/ConfigurableWarning",
        "RedstoneWizard08/DocumentationWarning",
        "RedstoneWizard08/Permitted",
        "RedstoneWizard08/CKANDex",
    ];

    const enc = new TextEncoder();

    logInitPre(`Fetching information for ${repos.length} repositories...`);

    const tasks = [];
    let i = 0;

    for (const url of repos) {
        i++;

        tasks.push((async () => {
            const idx = i;
            const [user, id] = url.split("/");

            const repo = (await gh.rest.repos.get({ owner: user, repo: id }))
                .data;

            vfs.mkdirs(`/home/web-user/projects/${repo.name}`);

            vfs.write(
                `/home/web-user/projects/${repo.name}/description`,
                enc.encode(repo.description ?? "No description")
            );

            vfs.write(
                `/home/web-user/projects/${repo.name}/url`,
                enc.encode(repo.html_url)
            );

            logInitPre(`Task ${idx} completed!`);
        })());
    }

    logInitPre(`Running ${tasks.length} tasks asynchronously...`);

    await Promise.all(tasks);

    logInit("Successfully fetched repository information!");

    uid.set(curUid);
    gid.set(curGid);
};
