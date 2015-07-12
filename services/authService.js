module.exports = function(server) {
    var User = require('../models/user.js');

    server.post('/auth/local', function(req, res, next) {
        var user = req.body.local;
        User.findOne({
            local: {
                email: user.email,
                password: user.password
            }
        }, function(err, user) {
            if (err) {
                res.json({
                    success: false,
                });
            } else {
                res.json({
                    success: true,
                    object: user
                });
            }
        });
    });

    server.put('/auth/social', function(req, res, next) {
        var type = req.body.type;
        var id = req.body.user.id;
        var accessToken = req.body.user.accessToken;

        var query = null;
        var update = null;
        var options = {
            upsert: false,
            multi: true
        };

        if (type === 'facebook') {
            query = {
                'facebook.id': id
            };
            update = {
                $set: {
                    'facebook.accessToken': accessToken
                }
            };
        } else if (type === 'google') {
            query = {
                'google.id': id
            };
            update = {
                $set: {
                    'google.accessToken': accessToken
                }
            };
        } else {
            res.json({
                success: false
            });
        }
        User.update(
            query,
            update,
            options,
            function(err, numAffected) {
                if (err) {
                    res.json({
                        success: false
                    });
                } else {
                    res.json({
                        succes: true,
                        message: 'Successfully updated accessToken, login success'
                    });
                }
            }
        );
    });
}