var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	registeredEmail: String,
	accountType: String,
	referredBy: String,
	registeredOn: { 
		type: Date, 
		default: Date.now 
	},
	local: {
		email: String,
		password: String,
		name: String,
		picture: String
	}, 
	facebook: {
		accessToken: String,
		id: String,
		email: String,
		name: String,
		link: String,
		gender: String,
		picture: String,
		friends: [{
			id: String,
			name: String
		}]
	},
	google: {
		accessToken: String,
		id: String,
		email: String,
		name: String,
		link: String,
		gender: String,
		picture: String,
		friends: [{
			id: String,
			displayName: String,
			image: {
				url: String
			},
			url: String
		}]
	}
});

module.exports = mongoose.model('User', userSchema);