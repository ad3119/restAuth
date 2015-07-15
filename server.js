var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    regex = require('regex'),
    bcrypt = require('bcrypt-nodejs'),
    server = express();

require('./multerConfig.js')(server, multer);

server.set('port', process.env.PORT || 8090);
server.use(morgan('dev'));
server.use(cookieParser());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(cors());

require('./services/registrationService.js')(server, bcrypt);
require('./services/authService.js')(server, bcrypt);
require('./services/userService.js')(server, fs, path);

mongoose.connect('mongodb://localhost/restAuth', function(err) {
    if (err) {
        console.log(err);
    } else {
        server.listen(server.get('port'), function() {
            console.log('Express server listening at port ' + server.get('port'));
        });
    }
});