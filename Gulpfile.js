const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const browserSync	= require("browser-sync").create();
const typescriptConfig = require("./tsconfig.json");
const dist = "../public/assets"
const vhost = "http://gulp:80"

gulp.task("scripts", () => {
	return browserify({
		basedir: ".",
		debug: true, // allows tsify to do sourcemaping 
		entries: ["scripts/index.ts"],
		cache: {},
		packageCache: {}
	})
		.plugin(tsify, typescriptConfig)
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

gulp.task("watch", ["scripts"], () => {

	// Serve files from this project"s virtual host that has been configured with the server rendering this site
	browserSync.init({
		proxy : vhost,
		files: [
			{
				options: {
					ignored: ".*"
				}
			}
		],
		logPrefix: vhost,
		reloadOnRestart: true,
		notify: false
	});

	gulp.watch( ["scripts/**"], ["scripts"] );
	// gulp.watch( watch.styles, ["style"] );
	// gulp.watch( watch.views ).on("change", browserSync.reload);
	gulp.watch( ["../public/*.html"] ).on("change", browserSync.reload);
});

gulp.task("default", ["watch"])