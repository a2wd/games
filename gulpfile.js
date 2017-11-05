var gulp = require("gulp")
var browserSync = require("browser-sync")

gulp.task("reload", function(done){
	browserSync.reload()
	done()
})

gulp.task("default", function(){
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	})

	gulp.watch("./app/js/*.js", ["reload"])
	gulp.watch("./app/*.html", ["reload"])
	gulp.watch("./app/css/*.css", ["reload"])
})