module.exports = function(server, fs) {
  var User = require('../models/user.js');
  var ObjectId = require('mongoose').Types.ObjectId;

  /* Link local user with facebook or google account*/
  server.put('/account/link/:userId/:type', function(req, res, next) {
    var query = {
      _id: new ObjectId(req.params.userId)
    };
    var update = null;
    if(req.params.type === 'facebook') {
      update = {
      	$set: {
      	  facebook: req.body
      	}
      };
    } else if(req.params.type === 'google') {
      update = {
      	$set: {
      	  google: req.body
      	}
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
      	  message: 'Error while performing query'
      	});
      } else {
      	res.json({
      	  success: true,
      	  message: 'Account linked successfully'
      	});
      }
    });
  });

  /* Unlink facebook or google account */
  server.put('/account/unlink/:userId/:type', function(req, res, next) {
    var query = {
      _id: new ObjectId(req.params.userId)
    };
    var update = null;
    if(req.params.type === 'facebook') {
      update = {
        $set: {
          facebook: undefined
        }
      };
    } else if(req.params.type === 'google') {
      update = {
        $set: {
          google: undefined
        }
      };
    }
    var options = {
      multi: false,
      upsert: false
    };
    User.update(query, update, options, function(err, numAffected) {
      if(err) {
        res.json({
          success: false,
          message: 'Error while performing query'
        });
      } else {
        res.json({
          success: true,
          message: 'Account unlinked successfully'
        });
      }
    });
  });

  /* Delete user account */
  server.delete('/account/:userId', function(req, res, next){
    var query = {
    	_id: new ObjectId(req.params.userId)
    };
    var options = null;
    User.findOneAndRemove(query, options, function(err, user){
      if(err){
      	res.json({
      	  success: false,
      	  message: 'Error while performing query'
      	});
      } else{
      	if(user === null) {
      	  res.json({
      	    success: false,
      	    message: 'User not found'
      	  });
      	} else{
          if(user.accountType === 'local') {
            fs.readdir('./uploads', function(err, files) {
              files.forEach(function(file) {
                if(user.registeredEmail === file.replace(/\.[^/.]+$/, "")) {
                  fs.unlink('./uploads/'+file, function(err) {
                    if(err){
                      res.json({
                        success: false,
                        message: 'Error while deleting user profile picture'
                      });
                    } else {
                      res.json({
                        success: true,
                        message: 'Account deleted successfully'
                      });
                    }
                  });
                }
              });
            });
          } else{
            res.json({
              success: true,
              message: 'Account deleted successfully'
            });
          }
      	}
      }
    });
  });

};