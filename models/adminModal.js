const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminShema = new mongoose.Schema({
    urname:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    confirm:{
        type:String
    }
},{timestamps:true});



const adminModel = mongoose.model('Admin',adminShema)

module.exports = adminModel
