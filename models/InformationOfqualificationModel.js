const mongoose = require('mongoose')


qualificationInformationSchema = new mongoose.Schema({
    userId :{
        type:String
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