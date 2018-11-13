const passport = require('passport'),
      mongoose = require('mongoose');

const User = mongoose.model('User');

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.register = (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {"message": "All fields required"});
        return;
    }

    let user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save((err) =>{

        let token;
        token = user.generateJwt(user._doc);

        if (err) {
            sendJSONresponse(res, 400, {"message": "Error in user registration"});
        } else {
            sendJSONresponse(res, 200, {"token": token})
        }
    });
};

module.exports.login = (req, res) => {

    if(!req.body.email || !req.body.password) {
      sendJSONresponse(res, 400, {"message": "All fields required"});
      return;
    }

    passport.authenticate('local', (err, user, info) => {

        // If Passport throws/catches an error
        if (err) {
            sendJSONresponse(res,404,err);
            return;
        }
        // If a user is found
        if (user) {
            let token = user.generateJwt(user._doc);
            sendJSONresponse(res, 200, {"token": token})
        } else {
            // If user is not found
            sendJSONresponse(res,401,info);
        }
    })(req, res);
};