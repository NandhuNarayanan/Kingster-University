const mongoose  = require("mongoose");

const applicationSchema = new mongoose.Schema({
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

const applicationModel = mongoose.model('Application',applicationSchema);

module.exports= applicationModel