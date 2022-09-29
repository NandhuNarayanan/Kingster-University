const mongoose = require('mongoose')

const couponShema = new mongoose.Schema({
    couponCode:{
        type:String
    },
    discount:{
        type:String
    },
    couponName:{
        type:String
    }
},{timestamps:true});

const couponModel = mongoose.model('Coupen',couponShema)

module.exports = couponModel