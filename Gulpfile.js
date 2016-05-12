// GULP DEPENDENCIES
var gulp				 = require('gulp'),
	plugins			= require('gulp-load-plugins')(),
	runSequence	= require('run-sequence'),
	browserSync	= require('browser-sync').create();

// PROJECT PATHS AND DEPENDENCIES
var setup = require('./setup.json'),
	vhost = setup.vhost,
	src = setup.src,
	dest = setup.dest,
	watch = setup.watch,
	includes = setup.includes
	cdnBackups = setup.src.cdnBackups;

// MOVE CDN BACKUPS INTO THEIR RESPECTIVE FOLDERS, NON-CDN'S SHOULD BE ADDED TO THE SCRIPTS AND STYLES INCLUDES ARRAYS WITHIN SETUP.JSON
gulp.task('cdn-backups', function() {

	// JQUERY DEPENDENCY
	gulp.src( cdnBackups + 'jquery/dist/jquery.min.js' )
	.pipe(plugins.uglify())
	.pipe(gulp.dest( dest.js ));

});

// STYLE DEVELOPMENT TASK
gulp.task('style', function() {
	return gulp.src( src.styles )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.sass({
		includePaths: includes.styles
	}))
	.pipe(plugins.rucksack({
		autoprefixer: true
	}))
	.pipe(plugins.cssnano())
	.pipe(plugins.rename('app.min.css'))
	.pipe(gulp.dest( dest.css ))
	.pipe(browserSync.stream());
});

// JAVASCRIPT DEVELOPMENT TASKS
// Run custom JS through babel transpiler
gulp.task('babel', function() {
	return gulp.src( src.scripts )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.babel())
	.pipe(plugins.concat('babel.js'))
	.pipe(gulp.dest( dest.babel ));
});
// Concat custom JS file with the incdlues.scripts
gulp.task('scripts-concat', ['babel'], function() {
	return includes.scripts.push(src.babel);
});
gulp.task('script', ['scripts-concat'], function() {
	return gulp.src( includes.scripts )
	.pipe(plugins.concat('app.js'))
	.pipe(gulp.dest( dest.js ))
	// .pipe(plugins.uglify()) // WHEN GOING LIVE... uncomment out this and the next two lines, comment out the two before, update the src tag of your websites js to the minified version
	// .pipe(plugins.rename('app.min.js'))
	// .pipe(gulp.dest( dest.js ))
	.pipe(browserSync.stream());
});
// create production-ready JS file
gulp.task('script-production', function() {
	return gulp.src( dest.js + "")
});

// IMAGE TASK - COPY & COMPRESS
gulp.task('image', function() {
	return gulp.src( src.images )
		.pipe(plugins.imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
		}))
		.pipe(gulp.dest( dir.assets + images ));
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
gulp.task('watch', ['script', 'style'], function() {

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
		browser: ["google chrome", "firefoxdeveloperedition", "firefox", "safari"],
		reloadOnRestart: true,
		notify: false
	});

	gulp.watch( watch.scripts, ["script"] );
	gulp.watch( watch.styles, ["style"] );
	gulp.watch( watch.views ).on("change", browserSync.reload);
});

// INITIALIZE PROJECT TASK
gulp.task('default', function(callback) {
	runSequence('font',
							['cdn-backups', 'style', 'script', 'image'],
							callback);
});
