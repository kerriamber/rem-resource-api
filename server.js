/**
 * Created by julia on 13.10.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cors = require('cors');
var log = require('winston');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index/router');
var imageRouter = require('./routes/images/router');
var userRouter = require('./routes/user/router');
mongoose.connect('mongodb://localhost/rra', (err) => {
    if (err) {
        return log.error("Unable to connect to Mongo Server!");
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', indexRouter);
app.use('/', imageRouter);
app.use('/', userRouter);
express.static('./images');
app.listen(7009, '127.0.0.1');
log.info('Server Started!');
