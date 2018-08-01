const mongoose = require('mongoose');


let carModel = new mongoose.Schema({
    brend: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
}, {
    versionKey: false
});
mongoose.model('Car', carModel);

module.exports = mongoose.model('Car');