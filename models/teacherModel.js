const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const teacherShema = new mongoose.Schema({
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



const teacherModel = mongoose.model('Teacher',teacherShema)

module.exports = teacherModel
