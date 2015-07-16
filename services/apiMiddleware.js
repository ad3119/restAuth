module.exports = function(server, jwt) {
    server.use(function(req, res, next) {
        var token = req.headers.authorization;
        if(token) {
            jwt.verify(token, server.get('secret'), function(err, decoded) {
                if(err) {
                    res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    return next();
                }
            });
        } else {
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    });
};