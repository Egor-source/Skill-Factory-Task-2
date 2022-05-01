//Название директории проекта
const projectFolder = 'dist';
//Название дириктории исходников
const sourceFolder = "src";

const webpCheckScript = 'webpCheck.js';
const fontsMixin = "fontsMixin.scss";
//Пути проекта
const build = {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css/`,
    js: `${projectFolder}/js/`,
    img: `${projectFolder}/img/`,
    fonts: `${projectFolder}/fonts/`
};
//Пути исходников
const source = {
    html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`],
    css: `${sourceFolder}/scss/style.scss`,
    js: `${sourceFolder}/js/*.js`,
    img: `${sourceFolder}/img/**/*.{jpg,png,ico,svg,gif,webp}`,
    fonts: `${sourceFolder}/fonts/*.ttf`
};

const soursDir = {
    root: `${sourceFolder}/`,
    css: `${sourceFolder}/scss/`,
    js: `${sourceFolder}/js/`,
    img: `${sourceFolder}/img/`,
    fonts: `${sourceFolder}/fonts/`
}

//Базовые файлы исхожников
const sourceFiles = {
        html: `${sourceFolder}/index.html`,
        css: `${sourceFolder}/scss/style.scss`,
        js: `${sourceFolder}/js/script.js`,
        fonts: `${sourceFolder}/scss/fonts.scss`
    }
    //Отслеживаемые файлы
const watch = {
    html: `${sourceFolder}/**/*.html`,
    css: `${sourceFolder}/scss/**/*.scss`,
    js: `${sourceFolder}/js/**/*.js`,
    img: `${sourceFolder}/img/**/*.{jpg,png,ico,svg,gif,webp}`,
    fonts: `${sourceFolder}/fonts/**/*.ttf`
};

const clean = `./${projectFolder}/`;

exports.fontsMixin = fontsMixin;
exports.webpCheckScript = webpCheckScript
exports.soursDir = soursDir;
exports.projectFolder = projectFolder;
exports.sourceFolder = sourceFolder;
exports.source = source;
exports.sourceFiles = sourceFiles;
exports.build = build;
exports.watch = watch;
exports.clean = clean;