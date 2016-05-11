# Front-End Boilerplate
A boiler plate for Front-End developers, built with gulp and browsersync.

This repo is the `_source` folder for your project. It can be placed wherever you like in your project, just be sure to update the paths variables within **Gulpfile.js**. It currently will put outputted js/css/font/image files in a sibling `public/dist` directory. Directory structure looks like so...

```
- Project Folder
		- public
				- dist
		- _source (this directory is this repo)
				- **PROJECT FILES**
				- package.json
				- Gulpfile.js
```

#Getting Started
1. Add repo to project as **`_source`** folder
2. Cut ties with this repo, make sure to include it in you project repo.
3. Run `npm install` in the terminal
4. Within **setup.json**...
	1. Set the dir.root variable to match whatever your virtual host URL is for the given project
	2. If needed, change paths to match your project. It's currently setup in a manner that works well with WordPress/Sage.
	3. Add your styles and scripts **includes** (usually from node_modules/\*\*).
		- The scripts that you add here will be prepended to your concatenated app.js file.
		- The styles you add here will be accessible as includes within your app.scss file.


##How to add project dependencies/includes
1. In terminal run, `npm i --save <<dependency>>`
2. In **setup.json**, locate the **includes** object
3. Add the file path within the respective **styles** or **scripts** array.


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

##Watching files & live reload (Browsersync)
- You can change which files browsersync is watching within the **watch** array within setup.json.
