const mongoose  = require("mongoose");

const programSchema = new mongoose.Schema({
    program:{
        type:String
    },
    applicationFee:{
        type:Number
    },
    kitAmount:{
        type:Number
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
},{timestamps:true})

const programModel = mongoose.model('Program',programSchema);

module.exports= programModel