module.exports = function(server, fs, path) {
    var User = require('../models/user.js');
    var ObjectId = require('mongoose').Types.ObjectId;

    /* Get a user by object id */
    server.get('/user/:id', function(req, res, next) {
        if(!req.params.id) {
            return next();
        }
        var query = {
            '_id': new ObjectId(req.params.id)
        };
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

    /* Get user profile picture */
    server.get('/user/local/:imageName', function(req, res, next) {
        if(!req.params.imageName) {
            return next();
        }
        fs.readdir('./uploads', function(err, files) {
            files.forEach(function(file) {
                if(req.params.imageName === file.replace(/\.[^/.]+$/, "")) {
                    res.sendFile(path.join(__dirname, '../uploads', file));
                } 
            });
        });
    });
};