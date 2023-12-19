const db = require("../models");
const passport = require("../config/Passport");
const jwt = require('jsonwebtoken');

module.exports = {
    create: function(req, res) {  
        Users=new db.User({email: req.body.email, username: req.body.username });
        db.User.register(Users, req.body.password, (err, user) => {
            if (err) {
              console.log("ERROR: " + err)
                res.json({success: false, message: "Your account could not be saved. ", err});
            } else {
                res.json({success: true, message: "Your account has been created"});
            };
        });
    },
    login: function(req, res) {
        if(!req.body.username){ 
          console.log('username not given');
            res.json({success: false, message: "Username was not given"}) 
          } else { 
            if(!req.body.password){ 
              console.log('password not given')
              res.json({success: false, message: "Password was not given"}) 
            }else{ 
              passport.authenticate('local', function (err, user, info) {  
                 if(err){ 
                  console.log("ERROR: " + err)
                   res.json({success: false, message: err}) 
                 } else{ 
                  if (! user) { 
                    console.log('username/password incorrect')
                    res.json({success: false, message: 'Your username and/or password is incorrect'}) 
                  } else{ 
                    req.login(user, function(err){ 
                      if(err){ 
                        console.log('error 232')
                        res.json({success: false, message: err}) 
                      }else{ 
                        const token =  jwt.sign({userId : user._id,  
                           username:user.username}, process.env.tokenSecret); 
                        res.json({success:true, message:"Authentication successful", token: token }); 
                      }; 
                    }); 
                  }; 
                 }; 
              })(req, res); 
            }; 
          }; 
    },

    verify: function(req, res) {
      const jwToken = req.params.token;
      jwt.verify(jwToken, process.env.tokenSecret, function(err, decoded) {
        if (!err) {
          res.json({success: true});
        } else {
          res.send(err);
        };
      });
    },
};