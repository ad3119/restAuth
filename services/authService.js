module.exports = function(server, bcrypt) {
    var User = require('../models/user.js');

    server.post('/auth/local', function(req, res, next) {
        User.findOne({
            'local.email': req.body.local.email
        }, function(err, user) {
            if (err) {
                res.json({
                    success: false,
                });
            } else {
                if(user === null) {
                    res.json({
                        success: false,
                        message: 'User not found'
                    })
                } else {
                    if(bcrypt.compareSync(req.body.local.password, user.local.password)) {
                        res.json({
                            success: true,
                            object: user
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Wrong password'
                        });
                    }
                }
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