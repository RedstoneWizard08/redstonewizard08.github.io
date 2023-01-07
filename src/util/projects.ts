import type { LanguageIcon } from "./icons";

export interface Project {
    id: string;
    name: string;
    repo?: string;
    description: string;
    stack: LanguageIcon[];
}

export const projects: Project[] = [
    {
        id: "mayhem-rs",
        name: "Mayhem.rs",
        repo: "RedstoneWizard08/mayhem@github:",
        description: "A Discord-like chat application for security, stability, speed, and ultimate customization.",
        stack: ["rust", "typescript", "sass", "bash", "react", "git", "github"],
    },
    {
        id: "go-dragon",
        name: "GoDragon",
        repo: "RedstoneWizard08/dragon@github:",
        description: "An alternative to the Pterodactyl control panel, written in Go, TypeScript, and SASS.",
        stack: ["go", "typescript", "sass", "bash", "svelte", "git", "github"],
    },
    {
        id: "choo-js",
        name: "Choo.js",
        repo: "Choo-js/Choo@github:",
        description: "A multilingual full-stack web application toolkit, inspired by Ruby on Rails.",
        stack: ["typescript", "git", "github"],
    },
    {
        id: "flow",
        name: "Flow",
        repo: "nosadnile/flow@github:",
        description: "The source code for the NoSadNile main plugin.",
        stack: ["java", "git", "github"],
    },
    {
        id: "ludev",
        name: "Ludev",
        repo: "RedstoneWizard08/ludev@github:",
        description: "An AIO monorepo that makes working on ludic easier in GitPod.",
        stack: ["rust", "typescript", "bash", "git", "github"],
    },
    {
        id: "youtube-player",
        name: "YouTube Player",
        repo: "RedstoneWizard08/YouTubePlayer@github:",
        description: "A terrible clone of the YouTube video player.",
        stack: ["typescript", "sass", "git", "github"],
    },
    {
        id: "opendocs",
        name: "OpenDocs",
        repo: "opendocs-editor@github:",
        description: "A WYSIWYG editor like Google Docs that supports Dyslexia, and as a bonus, custom fonts.",
        stack: ["typescript", "javascript", "html", "css", "git", "github"],
    },
    {
        id: "simple-semver",
        name: "Simple SemVer",
        repo: "RedstoneWizard08/simple-semver@github:",
        description: "A simple SemVer library for Rust.",
        stack: ["rust", "git", "github"],
    },
    {
        id: "gcsrv",
        name: "GCSrv",
        repo: "RedstoneWizard08/gcsrv@github:",
        description: "The modpack for my private Galacticraft+ server.",
        stack: ["bash", "java", "docker", "linux", "git", "github"],
    },
];

export const resolveRepo = (project?: Project) => {
    if (project && project.repo && project.repo.includes("@github:")) {
        const ghUrl = project.repo.replace("@github:", "");
        return `https://github.com/${ghUrl}`;
    }

    return undefined;
};
