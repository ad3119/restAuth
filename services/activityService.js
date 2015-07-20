module.exports = function(server) {
	var Activity = require('../models/activityLog.js');

	server.post('/activity', function(req, res, next) {
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
};