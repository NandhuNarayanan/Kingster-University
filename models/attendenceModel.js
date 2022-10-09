const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const attendanceShema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    attendance:{
        type:String
    },
    day:{
        type:String
    },
    depatment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
    ,
    semester:{
        type:String
    }
},{timestamps:true});



const attendanceModel = mongoose.model('Attendance',attendanceShema)

module.exports = attendanceModel
