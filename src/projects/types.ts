export type IconifyIcon = `iconify:${string}`;
export type IconName = IconifyIcon;

export interface Skill {
    name: string;
    icon: IconName;
}

export interface State {
    name: string;
    icon: IconName;
    color: string;
}

export interface AuthorGroup {
    name: string;
    members: string[];
}

export type Author = string | AuthorGroup;

export interface ProjectInfo {
    id: string;
    alias: string[];
    name: string;
    authors: Author[];
    state: string;
    skills: string[];

    /**
     * The content of the project's readme.
     * THIS SHOULD NOT BE IN THE JSON! THIS SHOULD ONLY BE IN THE RUNTIME DATA! IT IS READ BY THE SERVER!
     */
    readme: string;
}

export type SkillIndex = Record<string, Skill>;
export type StateIndex = Record<string, State>;
