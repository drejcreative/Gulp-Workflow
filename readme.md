
# Gulp Workflow
![Gulp Workflow](Gulp template.jpg)

We've gone through the basics of Gulp and created a workflow that's able to compile Sass into CSS while watching HTML and JS files for changes at the same time. We can run this task with the `gulp` command in the command line.

We've also built a second task, build, that creates a dist folder for the production website. We compiled Sass into CSS, optimized all our assets, and copied the necessary folders into the dist folder. To run this task, we just have to type `gulp build` into the command line.

Lastly, we have a clean task that clears away from the generated dist folder any image caches that are created, allowing us to remove any old files that were inadvertently kept in dist.

* Spins up a web server
* Compiles Sass to CSS
* Using Autoprefixer to write vendor-free CSS code
* Refreshes the browser automatically whenever you save a file
* Optimizes all assets (CSS, JS, fonts, and images) for production
* Convert a set of images into a spritesheet and CSS variables via gulp


##Instructions

Make sure you have these installed

1. [Node.js](www.nodejs.org).
2. [git](www.git-scm.com).
3. Gulp via the Mac terminal or Gitbash on a PC > `npm install -g gulp`

Clone this repository into your local machine using the terminal (mac) or Gitbash (PC)
`git clone https://github.com/drejcreative/Gulp-Workflow.git`

CD to the folder with workflows
Run > `npm install` to install the project dependencies

Run the Gulp command > `gulp`

And add `http://localhost:3000` to you browser to live preview your work
