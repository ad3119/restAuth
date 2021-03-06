module.exports = function(server, bcrypt, jwt) {
    var User = require('../models/user.js');

    server.post('/registerLocal', function(req, res, next) {
        var password = bcrypt.hashSync(req.body.password)
        var user = new User({
            registeredEmail: req.body.email,
            accountType: 'local',
            'local.email': req.body.email,
            'local.password': password,
            'local.name': req.body.name,
            'local.picture': 'http://localhost:8090/auth/local/'+req.body.email
        });
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.json({
                    success: false
                });
            } else {
                // Success, generate the jwt
                var token = jwt.sign(user._id, server.get('secret'), {
                    expiresInMintues: 1440
                });
                res.json({
                    success: true,
                    message: 'Registration successful',
                    object: user,
                    token: token
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
                // Success, generate the jwt
                var token = jwt.sign(user._id, server.get('secret'), {
                    expiresInMintues: 1440
                });
                res.json({
                    success: true,
                    message: 'Registration successful',
                    object: user,
                    token: token
                });
            }
        });
    });
}