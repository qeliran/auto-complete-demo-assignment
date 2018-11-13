const mongoose = require('mongoose'),
    Animal = mongoose.model('Animal'),
    User = mongoose.model('User');

module.exports.GetAnimals = (req, res) => {

    Animal.find({"metaData.isSearchable": {$eq: true}})
        .then(records => {
            if (!records) {
                res.status(400).json({});}
            else{
                let names = records.map(record => record.name);
                res.status(200).json(names);
            }
        });
};

module.exports.InsertUpdateAnimal = (req, res) => {

    if (!req.body.userId) {
        res.status(401).json({"message": "UnauthorizedError: private action for logged users"});
    }
    if (!req.body.name) {
        res.status(400).json({"message": "All fields required"});
    }

    let animal = new Animal();

    animal.name = req.body.name;

    //validate user
    User.findById(req.body.userId)
        .then(user => {
            if (user.email) {
                //save animal of not exist, update if exist
                Animal.findOne({"name": animal.name})
                    .then(record => {
                        if (!record) {
                            animal.userSearchedRef.push(user.email);
                            animal.save((err) => {
                                if (err) {
                                    res.status(400).json({"message": "Error when saving object"});
                                } else {
                                    res.status(200).json({});
                                }
                            })
                        } else {
                            Animal.findById(record._id)
                                .then(record=>{

                                    //make searchable if 3 different users searched animal
                                    let uniqueArr = [...new Set(record.userSearchedRef)];

                                    if (uniqueArr.length == 2){
                                        record.metaData.isSearchable = true;
                                    }

                                    record.userSearchedRef.push(user.email);

                                    record.save(function (err, updatedRecord) {
                                        if (err){};
                                        res.status(200).json({});
                                    });
                                })
                        }
                    })
            } else {
                res.status(400).json({"message": "User id not found"});
            }
        });
};
