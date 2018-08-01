const express = require('express');


const carRouter = require('./src/routes/carRouter');
let bodyParser = require('body-parser');

let app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let db;
if (process.env.ENV === 'Test') {
    db = mongoose.connect(process.env.MONGODB_TEST, {
        useNewUrlParser: true
    });
} else {
    db = mongoose.connect(process.env.MONGODB_LOCAL, {
        useNewUrlParser: true
    });
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/cars', carRouter);

app.get('/', (req, res) => {
    res.send("Hello");
});

let server = app.listen(process.env.PORT);


module.exports = {
    server: server,
    app: app
};