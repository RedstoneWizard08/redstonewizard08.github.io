export const languages = {
    html: "devicon-html5-plain colored",
    javascript: "devicon-javascript-plain colored",
    typescript: "devicon-typescript-plain colored",
    css: "devicon-css3-plain colored",
    java: "devicon-java-plain-wordmark colored",
    c: "devicon-c-plain-wordmark colored",
    cpp: "devicon-cplusplus-plain colored",
    cs: "devicon-csharp-plain colored",
    bash: "devicon-bash-plain",
    dotnet: "devicon-dotnetcore-plain colored",
    go: "devicon-go-original-wordmark colored",
    markdown: "devicon-markdown-original",
    php: "devicon-php-plain colored",
    rust: "devicon-rust-plain",
    sass: "devicon-sass-original colored",
    svelte: "devicon-svelte-plain colored",
    electron: "devicon-electron-original colored",
    react: "devicon-react-original colored",
    nestjs: "devicon-nestjs-plain-wordmark colored",
    nextjs: "devicon-nextjs-plain-wordmark",
    adonisjs: "devicon-adonisjs-original-wordmark colored",
    git: "devicon-git-plain-wordmark colored",
    github: "devicon-github-original-wordmark",
    gitlab: "devicon-gitlab-plain-wordmark colored",
    docker: "devicon-docker-plain colored",
    socketio: "devicon-socketio-original-wordmark",
    express: "devicon-express-original-wordmark",
    tailwindcss: "devicon-tailwindcss-original-wordmark colored",
    cmake: "devicon-cmake-plain-wordmark colored",
    gcc: "devicon-gcc-plain colored",
    gulp: "devicon-gulp-plain colored",
    nodejs: "devicon-nodejs-plain-wordmark colored",
    npm: "devicon-npm-original-wordmark colored",
    webpack: "devicon-webpack-plain-wordmark colored",
    yarn: "devicon-yarn-plain-wordmark colored",
    godot: "devicon-godot-plain-wordmark colored",
    unity: "devicon-unity-original",
    unrealengine: "devicon-unrealengine-original",
    threejs: "devicon-threejs-original-wordmark",
    debian: "devicon-debian-plain-wordmark colored",
    figma: "devicon-figma-plain colored",
    canva: "devicon-canva-plain colored",
    filezilla: "devicon-filezilla-plain-wordmark colored",
    firefox: "devicon-firefox-plain colored",
    jenkins: "devicon-jenkins-plain colored",
    jira: "devicon-jira-plain-wordmark colored",
    linux: "devicon-linux-plain",
    mongodb: "devicon-mongodb-plain-wordmark colored",
    mysql: "devicon-mysql-plain-wordmark colored",
    raspberrypi: "devicon-raspberrypi-line colored",
    ubuntu: "devicon-ubuntu-plain colored",
    blender: "devicon-blender-original colored",
};

export type LanguageIcon = keyof typeof languages;

export const getIcon = (icon: LanguageIcon) => {
    return languages[icon];
};

export const getIcons = (icons: LanguageIcon[]) => {
    return icons.map((i) => getIcon(i));
};
