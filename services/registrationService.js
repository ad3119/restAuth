module.exports = function(server) {
    var User = require('../models/user.js');

    server.post('/register', function(req, res, next) {
        var user = new User(req.body);
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.json({
                    success: falses
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