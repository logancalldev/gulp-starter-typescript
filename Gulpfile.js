// GULP DEPENDENCIES
var gulp				 = require('gulp'),
	plugins			= require('gulp-load-plugins')(),
	runSequence	= require('run-sequence'),
	browserSync	= require('browser-sync').create(),
	typescriptProject = plugins.typescript.createProject('tsconfig.json'),
	tslintConfig = require('./tslint.json');

// PROJECT PATHS AND DEPENDENCIES
var setup = require('./setup.json'),
	vhost = setup.vhost,
	src = setup.src,
	dest = setup.dest,
	watch = setup.watch,
	includes = setup.includes
	cdnBackups = setup.src.cdnBackups;

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

// JAVASCRIPT DEVELOPMENT TASKS
gulp.task('tslint', () => {
	return gulp.src( src.scripts )
	.pipe(plugins.tslint(tslintConfig))
	.pipe(plugins.tslint.report())
})

gulp.task('script', ['tslint'], function() {
	var tsResults = gulp.src( src.scripts )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.sourcemaps.init())
	.pipe(typescriptProject())

	return tsResults
	.pipe(plugins.concat('app.min.js'))
	.pipe(plugins.sourcemaps.write('.'))
	.pipe(gulp.dest( dest.js ))
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
		reloadOnRestart: true,
		notify: false
	});

	gulp.watch( watch.scripts, ["script"] );
	gulp.watch( watch.styles, ["style"] );
	gulp.watch( watch.views ).on("change", browserSync.reload);
});

// MOVE CDN BACKUPS INTO THEIR RESPECTIVE FOLDERS, NON-CDN'S SHOULD BE ADDED TO THE SCRIPTS AND STYLES INCLUDES ARRAYS WITHIN SETUP.JSON
gulp.task('cdn-backups', function() {

// JQUERY DEPENDENCY
// gulp.src( cdnBackups + 'jquery/dist/jquery.min.js' )
// .pipe(plugins.uglify())
// .pipe(gulp.dest( dest.js ));

// gulp.src( cdnBackups + 'jquery/dist/jquery.min.js' )
// .pipe(plugins.uglify())
// .pipe(gulp.dest( dest.js ));
//
// gulp.src( cdnBackups + 'bootstrap-sass/assets/javascripts/bootstrap.min.js')
// .pipe(gulp.dest( dest.js ))
//
// gulp.src( cdnBackups + 'bootstrap-sass/assets/stylesheets/**')
// .pipe(gulp.dest( src.css + 'bootstrap/' ))

});

// INITIALIZE PROJECT TASK
gulp.task('default', function(callback) {
	runSequence('font',
							['cdn-backups', 'style', 'script', 'image'],
							callback);
});
