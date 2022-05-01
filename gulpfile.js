const paths = require("./paths");
const { src, dest } = require('gulp'),
    gulp = require('gulp'),
    fileInclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    rigger = require('gulp-rigger'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoPrefixer = require("gulp-autoprefixer"),
    groupeMedia = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uflify = require('gulp-uglify-es').default,
    imgMin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webpHtml = require('gulp-webp-html'),
    webpCss = require('gulp-webp-css'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2');
const { mkdir, mkdirSync } = require('fs');
const fs = require('fs');
const imagemin = require("gulp-imagemin");

//Создает базовые дириктории и файлы 
function CreateDir(project, files) {
    try {
        for (let i in project) {
            if (!fs.existsSync(project[i])) {
                mkdirSync(project[i]);
                console.log(`Directory created :${project[i]}`);
            }
        }
        for (let i in files) {

            if (!fs.existsSync(files[i])) {
                fs.open(files[i], 'w', (err) => {
                    if (err) throw err;
                    console.log(`File created:${files[i]}`);
                });
            }

        }

    } catch (err) {
        console.log(err);
    }

}

async function InitProject() {
    CreateDir(paths.soursDir, paths.sourceFiles);

    if (!fs.existsSync(`${paths.soursDir.js}/${paths.webpCheckScript}`)) {
        fs.appendFileSync(paths.source.js, "//= ../js/webpCheck.js");
        src(paths.webpCheckScript)
            .pipe(dest(paths.soursDir.js))
    }

    if (!fs.existsSync(`${paths.soursDir.css}/${paths.fontsMixin}`)) {
        fs.appendFileSync(paths.source.css, '@import "fontsMixin.scss";\n@import "fonts.scss";');
        return src(paths.fontsMixin)
            .pipe(dest(paths.soursDir.css))

    }
}
//Автоматически обновляет браузер после редактирования файлов
function BrowserSync() {
    browserSync.init({
        server: {
            baseDir: paths.clean
        },
        notify: false,
        port: 5500,
    });
}

//Обрабатывает html файлы
function html() {
    return src(paths.source.html)
        .pipe(fileInclude())
        .pipe(webpHtml())
        .pipe(dest(paths.build.html))
        .pipe(browserSync.stream())
}
//Удаляет лишнии файлы
function clean() {
    return del(paths.clean);
}
//Обрабатывает scss файлы
function css() {
    return src(paths.source.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(groupeMedia())
        .pipe(webpCss())
        .pipe(dest(paths.build.css))
        .pipe(autoPrefixer({
            cascade: true,
            overrideBrowserslist: ["last 5 version"]
        }))
        .pipe(cleanCss())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(dest(paths.build.css))
        .pipe(browserSync.stream())
}
//Обрабатывает js файлы
function js() {
    return src(paths.source.js)
        .pipe(rigger())
        .pipe(dest(paths.build.js))
        .pipe(uflify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(paths.build.js))
        .pipe(browserSync.stream())

}


//Обрабатывает фото
function img() {
    return src(paths.source.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(paths.build.img))
        .pipe(src(paths.source.img))
        .pipe(imgMin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optomizationLevel: 3
        }))
        .pipe(dest(paths.build.img))
        .pipe(browserSync.stream())
}
//Обрабатывает шрифты
function fonts() {

    src(paths.source.fonts)
        .pipe(ttf2woff())
        .pipe(dest(paths.build.fonts));

    return src(paths.source.fonts)
        .pipe(dest(paths.build.fonts))
        .pipe(ttf2woff2())
        .pipe(dest(paths.build.fonts))
}
//Подключает все шрифты в проект
function fontsStyle() {
    let file_content = fs.readFileSync(paths.sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(paths.sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(paths.build.fonts, function(err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(paths.sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {}

//Следит за изменением файлов
function watchFile() {
    gulp.watch([paths.watch.html], html);
    gulp.watch([paths.watch.css], css);
    gulp.watch([paths.watch.js], js);
    gulp.watch([paths.watch.img], img);
    gulp.watch([paths.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(css, html, js, img, fonts), fontsStyle);
const watch = gulp.series(gulp.parallel(build, watchFile, BrowserSync));

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = img;
exports.js = js;
exports.html = html;
exports.css = css;
exports.watch = watch;
exports.default = watch;
exports.build = build;
exports.init = InitProject;