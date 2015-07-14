module.exports = function(server) {
    var User = require('../models/user.js');

    server.post('/registerLocal', function(req, res, next) {
        var user = new User({
            registeredEmail: req.body.email,
            accountType: 'local',
            'local.email': req.body.email,
            'local.password': req.body.password,
            'local.picture': 'http://localhost:8090/user/local/'+req.body.email
        });
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.json({
                    success: false
                });
            } else {
                res.json({
                    success: true,
                    message: 'Registration successful',
                    object: user
                });
            }
        });
    });

    server.post('/register', function(req, res, next) {
        var user = new User(req.body);
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.json({
                    success: false
                });
            } else {
                res.json({
                    success: true,
                    message: 'Registration successful',
                    object: user
                });
            }
        });
    });
}