const mongoose  = require("mongoose");

const ProgramOfferedSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Program"
    },
    amountPayable:{
        type:String
    }
   
       

},{timestamps:true}) 

const ProgramOfferedModel = mongoose.model('ProgramOffered',ProgramOfferedSchema);
 
module.exports= ProgramOfferedModel