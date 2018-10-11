var gulp = require('gulp'),
  del = require('del'), 
  shell = require("gulp-shell"),
  tsc = require('gulp-tsc');

gulp.task("clean", () => {
  del("./dist/app");
})

gulp.task("tsc", ["clean"], () => {
  gulp.src(["./**/*.ts", "!./node_modules/**/*", "!./dist/**/*"])
  .pipe(tsc({
    module: "COMMONJS",
    target: "ES2015"
  }))
  .pipe(gulp.dest("./dist/app"));
});

gulp.task("npm", ["clean"], () => {
  gulp.src("./package*.json")
  .pipe(gulp.dest("./dist/app"))
  .pipe(shell(["npm install --production"], {
    cwd: "./dist/app"
  }));
});

gulp.task("copy", ["clean"], () => {
  gulp.src("./config/**/*")
  .pipe(gulp.dest("dist/app/config"));

  gulp.src("./package*.json")
  .pipe(gulp.dest("dist/app"));
});

gulp.task("contribute", ["tsc","copy", "npm"], () => {
  
});