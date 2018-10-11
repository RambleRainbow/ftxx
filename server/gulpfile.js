var gulp = require('gulp'),
  del = require('del'), 
  shell = require("gulp-shell"),
  tsc = require('gulp-tsc');

gulp.task("tsc", () => {
  del("./dist/app/src");
  gulp.src("src/**/*.ts")
  .pipe(tsc({
    module: "COMMONJS",
    target: "ES2015"
  }))
  .pipe(gulp.dest("./dist/app/src"));
});

gulp.task("npm", () => {
  gulp.src("package*.json")
  .pipe(gulp.dest("./dist/app"))
  .pipe(shell(["npm install --production"], {
    cwd: "./dist/app"
  }));
});

gulp.task("copy", () => {
  gulp.src("src/config/*")
  .pipe(gulp.dest("./dist/app/config"));

  gulp.src("src/views/*")
  .pipe(gulp.dest("./dist/app/src/views"));
})

gulp.task("contribute", ["tsc","npm", "copy"], () => {
  
});