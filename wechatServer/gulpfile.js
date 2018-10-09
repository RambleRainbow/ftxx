var gulp = require('gulp'),
  del = require('del'), 
  shell = require("gulp-shell"),
  tsc = require('gulp-tsc');

gulp.task("tsc", () => {
  del("./dist/**/*");
  gulp.src(["./**/*.ts", "!./node_modules/**/*", "!./dist/**/*"])
  .pipe(tsc({
    module: "COMMONJS",
    target: "ES2015"
  }))
  .pipe(gulp.dest("./dist/"));
});

gulp.task("npm", () => {
  gulp.src("./package*.json")
  .pipe(gulp.dest("./dist/"))
  .pipe(shell(["npm install --production"], {
    cwd: "dist"
  }));
});

gulp.task("copy", () => {
  gulp.src("./config/**/*")
  .pipe(gulp.dest("dist/config"));

  gulp.src("./package*.json")
  .pipe(gulp.dest("dist/"));
});

gulp.task("contribute", ["tsc","copy", "npm"], () => {
  
});