export interface Repo {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string | null;
    forks_count: number;
    open_issues_count: number;
    license: {
        key: string;
        name: string;
        spdx_id: string;
        url: string | null;
    } | null;
    default_branch: string;
}

export interface License {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
}

export interface Languages {
    [key: string]: number;
}

export interface ColorsJson {
    [key: string]: {
        color: string;
        url: string;
    };
}
