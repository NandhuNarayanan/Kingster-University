const mongoose = require('mongoose')



const courseSchema = new mongoose.Schema({
    course:{
        type:String
    },
    date:{
        type:Date
    },
    duration:{
        type:String
    },
    price:{
        type:Number
    },
    incharge:{
        type:String
    },
    department:{
        type:String
    },
    year:{  
        type:Number
    },
    discription:{
        type:String
    },
    qualification:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Qualification'
    }]

},{timestamps:true})

const courseModel = mongoose.model('Course',courseSchema);

module.exports= courseModel