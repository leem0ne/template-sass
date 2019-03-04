var gulp 					= require('gulp');
var sass 					= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var gcmq 					= require('gulp-group-css-media-queries');
var pug 					= require('gulp-pug');
var browserSync 	= require('browser-sync');
var imagemin			= require('gulp-imagemin');
var concat				= require('gulp-concat');
var uglify 				= require('gulp-uglify');
var csso 					= require('gulp-csso');
var spritesmith		= require('gulp.spritesmith'),
		cleanCSS 			= require('gulp-clean-css'),
		notify 				= require("gulp-notify");


var options = {
	path: '../1gulp3sass'
}


gulp.task('watch', ['pug', 'sass', 'browser-sync'], function(){
	gulp.watch(options.path + '/build/assets/sass/**/*.sass', ['sass']);
	gulp.watch(options.path + '/build/assets/**/*.pug', ['pug']);
	gulp.watch(options.path + '/build/js/*.js', browserSync.reload);
});

gulp.task('watch-sass', ['sass', 'browser-sync'], function(){
	gulp.watch(options.path + '/build/assets/sass/**/*.sass', ['sass']);
});


gulp.task('pug', function(){
	return gulp.src(options.path + '/build/assets/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.on("error", notify.onError({
			message: "Pug-Error: <%= error.message %>",
			title: "Pug"
		}))
		.pipe(gulp.dest(options.path+'/build'))
		.pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('sass', function () {
	return gulp.src(options.path + '/build/assets/sass/**/*.sass')
    .pipe(sass())
		.on("error", notify.onError({
			message: "SASS-Error: <%= error.message %>",
			title: "SASS"
		}))
    .pipe(gcmq())
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
        cascade: true
    }))
    .pipe(cleanCSS({compatibility: 'ie8', format: 'keep-breaks'}))
    .pipe(gulp.dest(options.path + '/build/css'))
    .pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: options.path,
		},
		notify: false
	});
});


gulp.task('imagemin', function(){
	return gulp.src(options.path + '/build/img/**/*')
		.pipe(imagemin({
			interlaced: true,
		    progressive: true,
		    optimizationLevel: 5,
		    svgoPlugins: [{removeViewBox: true}]
		}))
		.pipe(gulp.dest(options.path + '/build/img'));
});


var icons = 'icons';
gulp.task('imagesprite', function () {
  return gulp.src(options.path + 'build/img/' + icons + '/*.png')
  	.pipe(spritesmith({
  		algorithms: 'binary-tree',
	    imgName: icons + '.png',
	    cssFormat: 'css',
	    cssName: icons + '.css',
	    imgPath: '../img/' + icons + '.png',
	    padding: 10,
	  }))
	  .pipe(gulp.dest(options.path + '/build/img/'));
});


gulp.task('jsmin', function() {
  	return gulp.src([
  		'node_modules/jquery/dist/jquery.min.js',
			'node_modules/slick-carousel/slick/slick.min.js',
			'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
			options.path + '/build/libs/*.js'
		])
	    .pipe(concat('libs.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(options.path + '/js'));
});

gulp.task('cssmin', function() {
  	return gulp.src([
  			'node_modules/magnific-popup/dist/magnific-popup.css',
  			options.path + 'build/libs/*.css'
  		])
	    .pipe(concat('libs.min.css'))
	    .pipe(csso())
	    .pipe(gulp.dest(options.path + '/build/css'));
});






var smartgrid = require('smart-grid');
 
/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    container: {
        maxWidth: '1170px', /* max-width оn very large screen */
        fields: '15px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '1100px', /* -> @media (max-width: 1100px) */
            'fields': '15px' /* side fields */
        },
        md: {
            'width': '960px',
            'fields': '15px'
        },
        sm: {
            'width': '780px',
            'fields': '15px'
        },
        xs: {
            'width': '560px',
            'fields': '15px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};

gulp.task('smartgrid', function() {
  return smartgrid(options.path+'/build/assets/sass', settings);
});