# Front-End Boilerplate
A boiler plate for Front-End developers, built with gulp and browsersync.

This repo is the source folder for your project. It will process and put assets in a sibling `public/assets` directory. Directory structure looks like so...

```
- Project Folder
	- public
		- assets
	- source (this directory is this repo)
		- assets
		- package.json
		- Gulpfile.js
```

#Getting Started
1. Add repo to project as *source* folder
2. Cut ties with this repo, make sure to include it in you project repo.
3. Run `npm install` in the terminal
3. Within *Gulpfile.js*...
	1. Set the dir.root variable to match whatever your virtual host URL is for the given project
	2. Change dir.* paths to match your project, if needed.


##How to add project dependencies
1. In terminal run, `npm install -save <<dependency>>`
2. In *Gulpfile.js*, locate the "MOVE PROJECT DEPENDENCIES" gulp task
	1. Duplicate *JQUERY DEPENDENCY*
	2. Update *gulp.src* and *gulp.dest*to be sure the dependency is copied to the correct assets folder.


##Add images to project
- After copying new images within the *source/images* directory, simply run the "gulp image" task.


##Add icons to project
1. Duplicate one of the current *.svg*, rename to your new icon name.
2. Open *.svg* in Adobe Illustrator.
3. Draw icon.
4. Save your file as SVG with the following settings: (https://github.com/nfroidure/gulp-iconfont)
	- SVG Profiles: SVG 1.1
	- Fonts Type: SVG
	- Fonts Subsetting: None
	- Options Image Location: Embed
	- Advanced Options
		- CSS Properties: Presentation Attributes
		- Decimal Places: 1
		- Encoding: UTF-8
		- Output fewer elements: check
	- Leave the rest unchecked.
