module.exports = function(server) {
    var User = require('../models/user.js');
    server.get('/user/:email', function(req, res, next) {
        User.count({
            registeredEmail: req.params.email
        },
        function(err, count) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                console.log(count);
                res.json({
                    success: true,
                    object: count
                });
            }
        });
    });

    server.get('/user/:type/:email', function(req, res, next) {
        var type = req.params.type;
        var email = req.params.email;
        var query = null;
        if (type === 'local') {
            query = {
                'registeredEmail': email,
                'local.email': email
            };
        } else if (type === 'facebook') {
            query = {
                'registeredEmail': email,
                'facebook.email': email
            };
        } else if (type === 'google') {
            query = {
                'registeredEmail': email,
                'google.email': email
            };
        } else {
            res.json({
                success: false,
                message: 'Invalid query input'
            });
        }
        User.findOne(query, function(err, user) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error while performing query'
                });
            } else {
                res.json({
                    success: true,
                    object: user
                });
            }
        });
    });
};