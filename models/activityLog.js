var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var activitySchema = new Schema({
	userId: String,
	activity: String,
	timestamp: { 
		type: Date, 
		default: Date.now 
	}
});

module.exports = mongoose.model('ActivityLog', activitySchema, 'activityLog');