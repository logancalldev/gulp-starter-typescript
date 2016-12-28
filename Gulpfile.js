const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const tslint = require("gulp-tslint");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const rucksack = require("gulp-rucksack");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const syntax_scss = require('postcss-scss');
const typescriptConfig = require("./tsconfig.json"); // config options – https://www.typescriptlang.org/docs/handbook/compiler-options.html
const stylelintConfig = require("./.stylelintrc.json");
const conf = require("./config.json");

gulp.task("tslint", () =>
	gulp.src(["scripts/*.ts", "scripts/**/*.ts"])
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(tslint({
			formatter: "verbose",
			configuration: "tslint.json"
		}))
		.pipe(tslint.report({
			summarizeFailureOutput: true
		}))
);

gulp.task("scripts", ["tslint"], () => {
	return browserify({
		basedir: ".",
		debug: true, // allows tsify to do sourcemaping 
		entries: conf.scriptEntries,
		cache: {},
		packageCache: {}
	})
		.plugin(tsify, typescriptConfig)
		.bundle()
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(conf.dist))
		.pipe(browserSync.stream());
});

gulp.task("sass-lint", () => {
	const processors = [
		stylelint(stylelintConfig),
		reporter({
			clearMessages: true,
			throwError: true
		})
	];

	return gulp.src(conf.sassFilesToLint)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(postcss(processors, {syntax: syntax_scss}));
})

gulp.task("styles", ["sass-lint"], () => {
	return gulp.src(conf.sassIndex)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rucksack({ autoprefixer: true }))
		.pipe(cssnano())
		.pipe(rename("bundle.css"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(conf.dist))
		.pipe(browserSync.stream());
})

gulp.task("watch", ["scripts", "styles"], () => {
	// Serve files from this project"s virtual host that has been configured with the server rendering this site
	browserSync.init({
		proxy: conf.vhost,
		files: [
			{
				options: {
					ignored: ".*"
				}
			}
		],
		logPrefix: conf.vhost,
		reloadOnRestart: true,
		notify: false
	});

	gulp.watch(["scripts/**"], ["scripts"]);
	gulp.watch(["styles/**"], ["styles"]);
	gulp.watch([conf.watchedViews]).on("change", browserSync.reload);
});

gulp.task("default", ["watch"])