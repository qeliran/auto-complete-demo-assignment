const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose');

const User = mongoose.model('User');

passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (username, password, done) => {

        User.findOne({email: username}, (err, user) => {
            if (err) {
                return done(err);
            }

            // Return if user not found
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }

            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));