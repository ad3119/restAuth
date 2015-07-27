var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    regex = require('regex'),
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken'),
    server = express();

/* Configure multer */
require('./multerConfig.js')(server, multer);

server.set('port', process.env.PORT || 8090);
server.set('secret', 'greatest secret of all time');
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(cors());

/* Unprotected routes */
require('./services/registrationService.js')(server, bcrypt, jwt);
require('./services/authService.js')(server, bcrypt, jwt, fs, path);

/* Middleware to protect API routes */
require('./services/apiMiddleware.js')(server, jwt);

/* Protected routes */
require('./services/userService.js')(server, fs, path);
require('./services/activityService.js')(server);
require('./services/accountService.js')(server, fs);
require('./services/referralService.js')(server);

mongoose.connect('mongodb://localhost/restAuth', function(err) {
    if (err) {
        console.log(err);
        return;
    } else {
        server.listen(server.get('port'), function() {
            console.log('Express server listening at port ' + server.get('port'));
        });
    }
});