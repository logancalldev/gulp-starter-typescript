# Front-End Boilerplate
A boiler plate for Front-End developers, built with gulp and browsersync.

This repo is the `_source` folder for your project. It can be placed wherever you like in your project, just be sure to update the paths variables within **Gulpfile.js**. It currently will put assets in a sibling `public/assets` directory. Directory structure looks like so...

```
- Project Folder
		- public
				- assets
		- _source (this directory is this repo)
				- **PROJECT FILES**
				- package.json
				- Gulpfile.js
```

#Getting Started
1. Add repo to project as **`_source`** folder
2. Cut ties with this repo, make sure to include it in you project repo.
3. Run `npm install` in the terminal
3. Within **Gulpfile.js**...
	1. Set the dir.root variable to match whatever your virtual host URL is for the given project
	2. Change dir.** paths to match your project, if needed.


##How to add project dependencies
1. In terminal run, `bower install --save-dev <<dependency>>`
2. In **Gulpfile.js**, locate the **MOVE PROJECT DEPENDENCIES** gulp task
	1. Duplicate **JQUERY DEPENDENCY**
	2. Update **gulp.src** and **gulp.dest** to be sure the dependency is copied to the correct assets folder.


##Add images to project
- After copying new images within the **`_source`/images** directory, simply run the "gulp image" task.


##Add icons to project
1. Duplicate one of the current **.svg**, rename to your new icon name.
2. Open **.svg** in Adobe Illustrator.
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


#IF WORDPRESS SITE...
- Within `Gulpfile.js`, change dir.root to "./"
- Within `Gulpfile.js`, you may want to comment out the php section of the gulp watch task, `gulp.watch( watchViews ).on("change", browserSync.reload);`. If you choose to not do so, every instance of the webpage will reload, everytime you change anything php file or anything within the wordpress admin.
