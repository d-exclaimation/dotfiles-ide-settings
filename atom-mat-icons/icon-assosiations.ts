interface Settings {
    name: string,
    regex: string,
    icon: string
}

const all: Settings[] = [
    {
        name: "Yarn",
        regex: `^yarn\.lock$`,
        icon: "./yarn.svg",
    },
    {
        name: "Index",
        regex: `^index\.html$`,
        icon: "./html.svg",
    },
    {
        name: "Node index",
        regex: `^index\.(ts|js)$`,
        icon: "./node.svg",
    },
    {
        name: "nest-everything (because I'm lazy)",
        regex: `.*\.(controller|pipes|guard|middleware|service|module|interceptor)\.ts$`,
        icon: "./nest-pipes.svg",
    },
];