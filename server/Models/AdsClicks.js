const mongoose = require('mongoose');


const Schemax = new mongoose.Schema({

    ads : {
        type : String, 
        ref: 'ads'
    },
    adser : {
        type : String, 
        required : true
    }
    
}, {
    timestamps : true
});


module.exports = mongoose.model('adsclicks', Schemax);