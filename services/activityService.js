module.exports = function(server) {
	var Activity = require('../models/activityLog.js');

	/* Posts a user activity */
	server.post('/activity', function(req, res, next) {
		if(req.params.userId) {
			return next();
		}
		var activity = new Activity(req.body);
		activity.save(function(err) {
			if(err) {
				res.json({
					success: false
				});
			} else {
				res.json({
					success: true,
					message: 'Activity log updated successfully'
				});
			}
		});
	});

	/* Returns the complete activity log of a user */
	server.get('/activity/:userId', function(req, res, next) {
		var query = { userId: req.params.userId };
		Activity.find(query, function(err, logs) {
			if(err) {
				res.json({
					success: false
				});
			} else {
				res.json({
					success: true,
					object: logs
				});
			}
		});
	});

	/* Get a user's previous login timestamp */
	server.get('/activity/login/previous/:userId', function(req, res, next) {
		var query = {
			activity: 'login',
			userId: req.params.userId
		};
		Activity.find(query).sort({'timestamp': -1}).skip(1).limit(1).exec(function(err, logs) {
			if(err) {
				res.json({
					success: false,
					message: 'Failed to execute query'
				});
			} else {
				if(logs.length === 0) {
					res.json({
						success: false,
						message: 'First ever login, or invalid userId'
					});
				} else {
					res.json({
						success: true,
						object: logs[0].timestamp
					});
				}
			}
		});
	});
};