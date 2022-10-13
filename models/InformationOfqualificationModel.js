const mongoose = require('mongoose')



const qualificationInformationSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    tenthDetails:{
    type:Number
   },
   qualificationDocumentOftenth:{

   },
   tenthSchoolState:{
    type:String
   },

   tenthSchoolDistrict:{
        type:String
    },
    tenthSchoolCity:{
        type:String
    },
    tenthSchoolName:{
        type:String
    },
    tenthBoard:{
        type:String
    },
    plustwoDetails:{
        type:Number
    },
    GradeorPercentage:{
        type:Number
    },
    qualificationDocumentOfPlustwo:{
       
    },
    plustwoSchoolState:{
        type:String
    },
    plustwoSchoolDistrict:{
        type:String
    },
    plustwoSchoolCity:{
        type:String
    },
    plustwoSchoolName:{
        type:String
    },
    plustwoBoard:{
        type:String
    }


},{timestamps:true});

const qualificationInformationModel = mongoose.model('InformationOfQualification',qualificationInformationSchema)

module.exports = qualificationInformationModel