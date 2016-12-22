// GULP DEPENDENCIES
var gulp				 = require('gulp'),
	plugins			= require('gulp-load-plugins')(),
	runSequence	= require('run-sequence'),
	browserify = require("browserify"),
	source = require('vinyl-source-stream'),
	tsify = require("tsify"),
	browserSync	= require('browser-sync').create(),
	watchify = require("watchify"),
	buffer = require('vinyl-buffer'),
	tsProject = plugins.typescript.createProject("tsconfig.json");
	// typescriptProject = plugins.typescript.createProject('tsconfig.json');
	// tslintConfig = require('./tslintConfig.json');

// PROJECT PATHS AND DEPENDENCIES
var setup = require('./setup.json'),
	vhost = setup.vhost,
	src = setup.src,
	dest = setup.dest,
	watch = setup.watch,
	includes = setup.includes
	cdns = setup.src.cdns;

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['scripts/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
	return watchedBrowserify
	.transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts', '.js']
    })
	.bundle()
	.pipe(source('app.min.js'))
	.pipe(buffer())
	.pipe(plugins.sourcemaps.init({loadMaps: true}))
	.pipe(plugins.uglify())
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest(dest.js))
	.pipe(browserSync.stream())
}

gulp.task("script", bundle);

// STYLE DEVELOPMENT TASK
gulp.task('style', function() {
	return gulp.src( src.stylesApp )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.sass().on('error', plugins.sass.logError))
	.pipe(plugins.rucksack({
		autoprefixer: true
	}))
	.pipe(plugins.cssnano())
	.pipe(plugins.rename('app.min.css'))
	.pipe(plugins.sourcemaps.write())
	.pipe(gulp.dest( dest.css ))
	.pipe(browserSync.stream());
});

// IMAGE TASK - COPY & COMPRESS
gulp.task('image', function() {
	return gulp.src( src.images )
		.pipe(plugins.imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
		}))
		.pipe(gulp.dest( dest.images ));
});

// ICONFONTS TASK - reference for svg setup: https://github.com/nfroidure/gulp-iconfont
gulp.task('iconfont', function() {
  return gulp.src( src.svgs )
    .pipe(plugins.iconfont({ fontName: 'website-icons' }))
    .on('glyphs', function(glyphs, options) {
      gulp.src( src.iconTemplate )
        .pipe(plugins.consolidate('lodash', {
          glyphs: glyphs,
          fontName: 'website-icons',
          fontPath: '../fonts/',
          timestamp: Date.now(),
          className: 'icon'
        }))
        .pipe(plugins.rename('iconfont.scss'))
        .pipe(gulp.dest( dest.sass ));
    })
    .pipe(gulp.dest( dest.generatedFonts ));
});

// FONTS TASK
gulp.task('font', ["iconfont"], function() {
  return gulp.src( src.fonts )
    .pipe(gulp.dest( dest.fonts ))
});

// BROWSERSYNC WATCH TASK
gulp.task('default', ['script', 'style'], function() {

	// Serve files from this project's virtual host that has been configured with the server rendering this site
	browserSync.init({
		proxy : vhost,
		files: [
			{
				options: {
					ignored: '.*'
				}
			}
		],
		logPrefix: vhost,
		reloadOnRestart: true,
		notify: false
	});

	gulp.watch( watch.scripts, ["script"] ).on("end", browserSync.reload);
	gulp.watch( watch.styles, ["style"] );
	gulp.watch( watch.views ).on("change", browserSync.reload);
});

// MOVE CDN BACKUPS INTO THEIR RESPECTIVE FOLDERS, NON-CDN'S SHOULD BE ADDED TO THE SCRIPTS AND STYLES INCLUDES ARRAYS WITHIN SETUP.JSON
gulp.task('cdns', function() {

// JQUERY DEPENDENCY
// gulp.src( cdns + 'jquery/dist/jquery.min.js' )
// .pipe(plugins.uglify())
// .pipe(gulp.dest( dest.js ));
//
// gulp.src( cdns + 'bootstrap-sass/assets/javascripts/bootstrap.min.js')
// .pipe(gulp.dest( dest.js ))
// 
// gulp.src( [cdns + 'slick-carousel/slick/*.scss'])
// .pipe(gulp.dest( src.styles + 'slickslider/' ))

gulp.src( cdns + 'bootstrap-sass/assets/stylesheets/**')
.pipe(gulp.dest( src.styles + 'bootstrap/' ))

});

// INITIALIZE PROJECT TASK
// gulp.task('default', function(callback) {
// 	runSequence('font',
// 							['cdns', 'style', 'script', 'image'],
// 							callback);
// });
