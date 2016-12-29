# Yarn, Gulp, Typescript, Browserify, BrowserSync, Sass, Cachebusting, Linting

## Get Started
1. Make sure you have the following npm modules installed globally
	* yarn
	* gulp
	* typescript
	* tslint
	* typings
	* stylelint
2. Run `yarn` to install all dependencies
3. Take a look at the config.json, update the vhost and other variables to your liking
4. Run `gulp` to compile/minify/generate your files and to start live-reloading

### This gulp-starter does the following:
* Compiles Typescript into ES5 (JavaScript), which includes Browserify so you can use commonjs modules (import/export). **PLEASE NOTE:** Using this system ultimately compiles all of your TS/JS into one bundle.js... including the libaries you import. This starter is setup by default to import jQuery and Boostrap JS files.
* Compiles Sass into CSS
* Minifies images (loseless)
* Creates iconfont based on SVGs
* Livereloading on changes to source Typescript and Sass files
* Cachebusts CSS, JS, and iconfont files
* Linting Sass with Stylint (for better in-editor hinting, install the plugin for your code editor)
* Linting Typescript (for better in-editor hinting, install the plugin for your code editor)
* Scss and Typescript sourcemaps, so that you know which file errors occur in – not just it's location in the bundled file

### Using JavaScript libraries within Typescript
This is what **typings** are for (**MUST HAVE** in order for Typescript to work with regular JavaScript libraries). Be sure to have `typings` installed globally with npm. I've already setup the project to use both the jQuery and Bootstrap libraries with Typescript

Learn more about typings: 
1. https://github.com/typings/typings
2. http://definitelytyped.org/


