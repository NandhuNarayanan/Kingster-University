const mongoose  = require("mongoose");

const departmentSchema = new mongoose.Schema({
    
    department:{
        type:String
    },
    No_of_Students:{
        type:String
    },
    HOD:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Qualification'
    }
   
       

},{timestamps:true})

const departmentModel = mongoose.model('Department',departmentSchema);

module.exports= departmentModel