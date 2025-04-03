const {gulp, src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const replace = require('gulp-replace');
const del = require('del');

let cssJSName = 'will';

// BROWSERSYNC START
function startServer (done) {
	browserSync.init({
		proxy: 'http://localhost:8888',
	});
	done();
}

// BROWSERSYNC RELOAD
function reloadServer(done) {
  browserSync.reload();
  done();
}

// SCSS >> CSS
function scss (done) {
  return src('src/assets/scss/**/*.scss') // Gets all files ending with .scss in src/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(dest('src/assets/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));

	done();
}

// WATCH
function watchFiles (done) {
	watch('src/assets/scss/**/*.scss', scss);
	watch('src/*.html', reloadServer);
	watch('src/site/**/*.php').on("change", browserSync.reload);
	watch('src/assets/js/**/*.js', reloadServer);

	done();
}

//OPTIMISE CSS & JS
function optimiseCSSJS (done) {
	return src('src/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js', terser()))
	.pipe(gulpIf('*.css', cleanCSS()))
	.pipe(dest('dist'))
	done();
}

//COPY IMAGES
function images (done) {
	return src('src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(dest('dist/assets/images'))
	done();
}

//COPY FONTS
function fonts (done) {
	return src('src/assets/fonts/**/*')
	.pipe(dest('dist/assets/fonts'))
	done();
}

//Clean Dist
function clean (done) {
	return del(['dist/**'])
	done();
}

// **** KIRBY **** 

//OPTIMISE CSS & JS KIRBY
function optimiseCSSJSKirby (done) {
	return src('src/site/snippets/*.php')
	.pipe(useref())
	.pipe(gulpIf('*.js', terser()))
	.pipe(gulpIf('*.css', cleanCSS()))
	.pipe(dest('dist'))
	done();
}

// COPY SNIPPETS
function copyKirbySnippets(done) {
	return src('dist/*.php')
	.pipe(dest('dist/site/snippets'))
	done();
}

// DEL LAYOUTS
function delKirbySnippets (done) {
	return del(['dist/*.php']);
	done();
}

// COPY KIRBY
function copyKirby (done) {
	return src('src/kirby/**/*')
	.pipe(dest('dist/kirby'))
	done();
}

// COPY CONTENT
function copyContent(done) {
	return src('src/content/**/*')
	.pipe(dest('dist/content'))
	done();
}

// COPY SITE
function copySite(done) {
	return src('src/site/**/*')
	.pipe(dest('dist/site'))
	done();
}

// COPY MEDIA
function copyMedia(done) {
	return src('src/media/**/*')
	.pipe(dest('dist/media'))
	done();
}

// COPY STRIPE
function copyStripe(done) {
	return src('src/stripe/**/*')
	.pipe(dest('dist/stripe'))
	done();
}

// COPY IMAGE ASSETS
function copyImageAssets(done) {
	return src('src/assets/images/**/*')
	.pipe(dest('dist/assets/images'))
	done();
}

// COPY FONT ASSETS
function copyFontAssets(done) {
	return src('src/assets/fonts/**/*')
	.pipe(dest('dist/assets/fonts'))
	done();
}


// COPY PHP
function copyKirbyFinal (done) {
	return src(['src/*.php','src/*.htaccess'],{ dot: true })
	.pipe(dest('dist/'))
	done();
}

// CACHE BUST
function cacheBustCSSJS (done) {
	let timeString = new Date().getTime();
	let cssString = cssJSName + '.min.css';
	let jsString = cssJSName + '.min.js';

	return src('dist/site/snippets/*.php')
	.pipe(replace(cssString, function() {
        return cssString + "?t=" + timeString;
      }))
	.pipe(replace(jsString, function() {
        return jsString + "?t=" + timeString;
      }))
    .pipe(dest('dist/site/snippets'))
	done();
}


exports.default = series(parallel(scss,startServer), watchFiles);

exports.build = series(clean,scss,parallel(optimiseCSSJS,fonts,images));

exports.kirby = series(parallel(clean,scss),parallel(copySite,optimiseCSSJSKirby),copyKirbySnippets,delKirbySnippets,parallel(copyKirby,copyContent,copyMedia,copyStripe,copyImageAssets,copyFontAssets,copyKirbyFinal),cacheBustCSSJS);




