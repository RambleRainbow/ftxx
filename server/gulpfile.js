var gulp = require('gulp'),
  del = require('del'), 
  shell = require("gulp-shell"),
  tsc = require('gulp-tsc');

gulp.task("tsc", () => {
  del("dist/src");
  gulp.src("src/**/*.ts")
  .pipe(tsc({
    module: "COMMONJS",
    target: "ES2015"
  }))
  .pipe(gulp.dest("dist/src"));
});

gulp.task("npm", () => {
  gulp.src("package*.json")
  .pipe(gulp.dest("dist/"))
  .pipe(shell(["npm install --production"], {
    cwd: "dist"
  }));
});

gulp.task("copy", () => {
  gulp.src("src/config/*")
  .pipe(gulp.dest("dist/config"));

  gulp.src("src/views/*")
  .pipe(gulp.dest("dist/src/views"));
})

gulp.task("compile", ["tsc","npm", "copy"], () => {
  
});