const mongoose  = require("mongoose");

const professorsSchema = new mongoose.Schema({
    
    professors:{
        type:String
    },
    depatment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    }
   
       

},{timestamps:true})

const professorsModel = mongoose.model('Professors',professorsSchema);

module.exports= professorsModel