// GLOBALS
var gulp         = require("gulp");
		plugins      = require("gulp-load-plugins")(),
		runSequence  = require("run-sequence"),
		del          = require("del"),
		browserSync	 = require("browser-sync").create();


// DIRECTORIES
var publicDir = "../public/";

var dir = {
	root 	: "http://fe-boiler.local",
	s 		: "assets/",
	d 		: publicDir + "assets/"
};


// PATHS
var scripts 	= "scripts/",
		styles 		= "styles/",
		images 		= "images/",
		modules 	= "modules/",
		vendor 		= "bower_components/",
		icons 		= "icons/",
		fonts 		= "fonts/";


// CLEAN (DELETE) PRODUCED ASSETS
gulp.task("clean", function(callback) { del(dir.d); }); 


// INSTALL BOWER DEPENDENCIES
gulp.task("bower", function() { return plugins.bower(); });


// MOVE BOWER DEPENDENCIES INTO THEIR CORRECT WORKING DIRECTORIES
gulp.task("vendor", ["bower"], function() {

  // JQUERY DEPENDENCY
  gulp.src( vendor + "jquery/dist/jquery.min.js" )
  .pipe(gulp.dest( dir.d + scripts ));
});


// STYLE DEVELOPMENT TASK
gulp.task("style", function() {
  return gulp.src( dir.s + styles + "app.scss" )
  .pipe(plugins.plumber(function(error) {
    plugins.util.log(
      plugins.util.colors.red(error.message),
      plugins.util.colors.yellow('\r\nOn line: '+error.line),
      plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
      );
    this.emit('end');
  }))
  .pipe(plugins.sass())
  .pipe(plugins.rucksack({
    autoprefixer: true
  }))
  .pipe(plugins.rename('app.css'))
  .pipe(gulp.dest( dir.d + styles ))
  .pipe(browserSync.stream())
  .pipe(plugins.minifyCss())
  .pipe(plugins.rename('app.min.css'))
  .pipe(gulp.dest( dir.d + styles ))
});


// JAVASCRIPT DEVELOPMENT TASK
gulp.task("script", function() {
  return gulp.src( dir.s + scripts + "**" )
  .pipe(plugins.plumber(function(error) {
    plugins.util.log(
      plugins.util.colors.red(error.message),
      plugins.util.colors.yellow('\r\nOn line: '+error.line),
      plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
      );
    this.emit('end');
  }))
  .pipe(plugins.babel())
  .pipe(plugins.concat('app.js'))
  .pipe(gulp.dest( dir.d + scripts ))
  .pipe(plugins.uglify())
  .pipe(plugins.rename('app.min.js'))
  .pipe(gulp.dest( dir.d + scripts ))
  .pipe(browserSync.stream());
});


// IMAGE TASK - COPY & COMPRESS
gulp.task("image", function() {
  return gulp.src( dir.s + images + "**" )
    .pipe(plugins.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest( dir.d + images ))
});


// ICONFONTS TASK - 
gulp.task('iconfont', function() {
  gulp.src([ dir.s + icons + 'svg/*.svg'])
    .pipe(plugins.iconfont({ fontName: 'website-icons' }))
    .on('glyphs', function(glyphs, options) {
      gulp.src( dir.s + icons + 'iconfont.template')
        .pipe(plugins.consolidate('lodash', {
          glyphs: glyphs,
          fontName: 'website-icons',
          fontPath: '../fonts/',
          timestamp: Date.now(),
          className: 'icon'
        }))
        .pipe(plugins.rename('_iconfont.scss'))
        .pipe(gulp.dest( dir.s + styles + 'common/'));
    })
    .pipe(gulp.dest( dir.s + fonts ));

  gulp.src( dir.s + icons + 'flexslider/*')
    .pipe(gulp.dest( dir.s + fonts ));
});


// FONTS TASK
gulp.task('font', ["iconfont"], function() {
  return gulp.src( dir.s + fonts + "**" )
    .pipe(gulp.dest( dir.d + fonts ))
});


// MODULES TASK - A task to be used lightly, only when it's possible to limit a library/module (such as a calendar or lightbox) to a single or few pages it's being used on.
gulp.task("modules", function() {
	return gulp.src( dir.s + modules + "**" )
		.pipe(gulp.dest( dir.d + modules ))
});


// START BROWSERSYNC TASKS

	// MAIN BROWSERSYNC TASK
	gulp.task("watch", ["script", "style"], function() {
	// gulp.task("watch", ["script"],  function() {

		// Serve files from the root of this project
		browserSync.init({
			server: {
				baseDir: publicDir
			}
		});

		// Watch file tasks and run corresponding watch task
		gulp.watch( dir.s + scripts + "**", ["script"] );
		gulp.watch( dir.s + styles + "**", ["style"] );
		gulp.watch( [ publicDir + "*.html", publicDir + "**/*.html", publicDir + "**/**/*.html", publicDir + "**/**/**/*.html"]).on("change", browserSync.reload);
	});

	
// END BROWSERSYNC TASKS


// INITIALIZE PROJECT TASK
gulp.task("default", function(callback) {
  runSequence("vendor",
              "style",
              "script",
              "image",
              "font",
              "modules",
              callback);
});


// 


