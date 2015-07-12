var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    server = express();

server.set('port', process.env.PORT || 8090);
server.use(morgan('dev'));
server.use(cookieParser());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(cors());

require('./services/registrationService.js')(server);
require('./services/userService.js')(server);
require('./services/authService.js')(server);

mongoose.connect('mongodb://localhost/restifyAuth', function(err) {
    if (err) {
        console.log(err);
    } else {
        server.listen(server.get('port'), function() {
            console.log('Express server listening at port ' + server.get('port'));
        });
    }
});