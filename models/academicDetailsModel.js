const mongoose = require('mongoose')


const academicDetailsSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
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
    XII:{
        type:String
    },
    XIIStatus:{
        type:String
    },
    XIIExaminationState:{
        type:String
    },
    XIISchoolName:{
        type:String
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