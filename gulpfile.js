let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let gulpMocha = require('gulp-mocha');
let env = require('gulp-env');
// let supertest = require('supertest');

gulp.task('default', () => {
    nodemon({
            script: 'app.js',
            ext: 'js',
            env: {
                PORT: 3002,
                MONGODB_LOCAL: "mongodb://localhost:27017/cars"
            },
            ignore: ['./node_modules/**']
        })
        .on('restart', () => {
            console.log('Restart server')
        });
});


gulp.task('test', () => {
    env({ vars: { ENV: 'Test' } });
    gulp.src('./src/tests/*.js', { read: false })
        .pipe(gulpMocha({ reporter: 'nyan', exit: true }))
});