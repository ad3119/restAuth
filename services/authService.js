module.exports = function(server, bcrypt, jwt) {
    var User = require('../models/user.js');

    /* Local login */
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
                        // Success, generate the jwt
                        var token = jwt.sign(user._id, server.get('secret'), {
                            expiresInMintues: 1440
                        });
                        res.json({
                            success: true,
                            object: user,
                            token: token
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

    /* Social login */
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
                    // Success, generate the jwt
                    var token = jwt.sign({
                            id: id      // Payload, with facebook/google id
                        }, 
                        server.get('secret'), {
                        expiresInMintues: 1440
                    });
                    res.json({
                        succes: true,
                        message: 'Successfully updated accessToken, login success',
                        token: token
                    });
                }
            }
        );
    });

    /* Checks if a 'local' user is already registered */
    server.get('/auth/:email', function(req, res, next) {
        if(req.params.type && req.params.email) {
            return next();
        }
        User.count({
            registeredEmail: req.params.email
        },
        function(err, count) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                res.json({
                    success: true,
                    object: count
                });
            }
        });
    });

    /* Checks if a 'social' user is already registered */
    server.get('/auth/:type/:email', function(req, res, next) {
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
}