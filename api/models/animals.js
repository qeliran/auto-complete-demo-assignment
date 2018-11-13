const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        metaData: {
            isSearchable: {
                type: Boolean,
                default: false
            }
        },
        userSearchedRef: [String]
    },
    {
        usePushEach: true
    });

mongoose.model('Animal', animalSchema);