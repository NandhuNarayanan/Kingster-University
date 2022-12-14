const mongoose = require('mongoose')



const qualificationInformationSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    tenthpercentage:{
    type:Number
   },
   tenthCourseCommencementYear:{
    type:Number
   },
   tenthCourseCompletionYear:{
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
    GradeorPercentage:{
        type:Number
    },
    CourseCommencementYear:{
        type:Number
    },
    CourseCompletionYear:{
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