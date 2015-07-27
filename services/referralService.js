module.exports = function(server){
  var User = require('../models/user.js');
  var ObjectId = require('mongoose').Types.ObjectId;

  server.get('/referral/:userId/:referralCode', function(req, res, next) {
  	if(req.params.userId === req.params.referralCode || req.params.referralCode.length != 24) {
      res.json({
      	success: false,
      	message: 'Invalid code'
  	  });
  	} else {
  	  User.findOne({
  	  	_id: new ObjectId(req.params.referralCode)
  	  }, function(err, user) {
  	  	if(err) {
  	  	  res.json({
  	  	  	success: false,
  	  	  	message: 'Error while performing query'
  	  	  });
  	  	} else {
  	  	  if(user === null) {
  	  	  	res.json({
    		      success: false,
    		      message: 'Invalid code'
    		  	});
  	  	  } else{
  	  	  	var query = {
	            _id: new ObjectId(req.params.userId)
	      	  };
  	      	var update = {
  	          $set: {
  	            referredBy: req.params.referralCode
  	          }
  	        };
  	        var options = {
  	          multi: false,
  	          upsert: false
  	        };
    	  	  User.update(query, update, options, function(err, numAffected) {
    		      if(err) {
    		        res.json({
    	              success: false,
    	          	  message: 'Failed to update profile'
    	            });
    		      } else {
    		        res.json({
    		          success: true,
    		          message: 'Successfully applied code'
    		        });
    		      }
  	        });
  	  	  }
  	  	}
  	  });
  	}
  });
};