const mongoose  = require("mongoose");

const qualificationSchema = new mongoose.Schema({
    
qualification:{
        type:String
    },
    yearofpassout:{
        type:String
    }
   
       

},{timestamps:true})

const qualificationModel = mongoose.model('Qualification',qualificationSchema);

module.exports= qualificationModel