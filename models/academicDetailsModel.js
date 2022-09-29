const mongoose = require('mongoose')


academicDetailsSchema = new mongoose.Schema({
    userId :{
        type:String,
        required : true
    },
    XBoard:{
    type:String
   },
   ExaminationState:{
    type:String
   },
   SchoolName:{
    type:String
   },

   XDetails:{
        type:String
    },
    XIIorDiploma:{
        type:String
    },
    XIIStatus:{
        type:String
    },
    XIIExaminationState:{
        type:String
    },
    XIISchoolName:{
        type:Number
    },
    XIIDetails:{
        type:String
    },
    reference:{
        type:String
    },
    Program1:{
        type:String
    },
    Program2:{
        type:String
    }


},{timestamps:true});

const academicDetailsModel = mongoose.model('academicDetails',academicDetailsSchema)

module.exports = academicDetailsModel