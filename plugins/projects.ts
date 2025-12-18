import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import type { ProjectInfo } from "../src/projects/types.ts";
import type { AstroIntegration, ViteUserConfig } from "astro";

type NonArray<T> = T extends unknown[] ? never : T;
type NonPromise<T> = T extends Promise<unknown> ? never : T;
type NonFalse<T> = T extends false ? never : T;

type VitePlugin = NonFalse<
    NonPromise<NonNullable<NonArray<NonNullable<ViteUserConfig["plugins"]>[0]>>>
>;

const virtualId = "virtual:projects";
const resolvedId = "\0" + virtualId;
const dir = path.dirname(fileURLToPath(import.meta.url));

const loadProjects = async () => {
    const root = path.join(dir, "..", "src", "projects");
    const projects: Record<string, ProjectInfo> = {};
    const watches: string[] = [];

    for (const entry of await fs.readdir(root)) {
        const entryPath = path.join(root, entry);
        const info = await fs.stat(entryPath);

        if (info.isDirectory()) {
            watches.push(path.join(entryPath, "project.json"));
            watches.push(path.join(entryPath, "README.md"));

            const manifest: ProjectInfo = JSON.parse(
                await fs.readFile(
                    path.join(entryPath, "project.json"),
                    "utf-8",
                ),
            );

            manifest.readme = await fs.readFile(
                path.join(entryPath, "README.md"),
                "utf-8",
            );

            projects[manifest.id] = manifest;
        }
    }

    return [projects, watches] as const;
};

const projectsLoaderVite = (
    cgDir: URL,
): VitePlugin => {
    const file = fileURLToPath(new URL("projects.ts", cgDir));

    return {
        name: "projects-loader-vite",

        resolveId(id) {
            if (id == virtualId) {
                return resolvedId;
            }
        },

        async load(id) {
            if (id == resolvedId) {
                return await fs.readFile(file, "utf-8");
            }
        },
    };
};

export const projectsLoader = (): AstroIntegration => {
    let types = "";
    let projectsGen = "";

    return {
        name: "projects-loader",

        hooks: {
            async "astro:config:setup"(options) {
                const [projects, watches] = await loadProjects();

                const namesRaw = Object.keys(projects).map((it) => `"${it}"`)
                    .join(
                        " | ",
                    );

                const names = namesRaw == "" ? "never" : namesRaw;

                types = [
                    `import { ProjectInfo } from "@/projects/types.ts";`,
                    "",
                    `export type ProjectName = ${names};`,
                    "export type Projects = Record<ProjectName, ProjectInfo>;",
                ].join("\n");

                projectsGen = `export const projects = ${
                    JSON.stringify(projects)
                };`;

                const cgDir = options.createCodegenDir();

                for (const file of watches) {
                    options.addWatchFile(file);
                }

                await fs.writeFile(new URL("projects.ts", cgDir), projectsGen);

                options.updateConfig({
                    vite: {
                        plugins: [projectsLoaderVite(cgDir)],
                    },
                });
            },

            "astro:config:done"(options) {
                options.injectTypes({
                    filename: "projects.d.ts",
                    content: `declare module "virtual:projects" {\n${
                        types.split("\n").map((it) => ("    " + it).trimEnd())
                            .join("\n")
                    }\n    const projects: Projects;\n}`,
                });
            },
        },
    };
};

export default projectsLoader;
