const mongoose  = require("mongoose");

const admissionDetailsSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"Users"
    },
    program:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Program"
    }
   
       

},{timestamps:true}) 

const admissionDetailsModel = mongoose.model('AdmissionDetails',admissionDetailsSchema);

module.exports= admissionDetailsModel