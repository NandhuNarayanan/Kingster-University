const mongoose  = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"Users"
    },
    program:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Program"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    finalAmount:{
        type:String
    },
    OrderStatus:{
        type:Boolean,
        default:Boolean
    },
    paymentStatus:{
        type:String,
        default:'success'
    }
   
       

},{timestamps:true}) 

const paymentModel = mongoose.model('PaymentDetails',paymentSchema);
 
module.exports= paymentModel