const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.GetUser = (req, res) => {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User.findById(req.payload._id).then(record => {
            if (!record) {
                res.status(200).json(user);
            } else {
                res.status(400).json( {"message": "No user found by payload id"});
            }
        });
    }
};
