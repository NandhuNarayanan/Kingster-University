const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')


const userSchema= new mongoose.Schema({
    fname:{
        type:String,
        
    },
    lname:{
        type:String,
       
    },
    gender:{
         type: String
    },
    state:{
        type:String
    },
    city:{
        type:String
    },
    mobile:{
        type:Number
    },
    course:{
        type:String
    },
    QUALIFICATION:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        lowrcase:true,
    },
    password:{
       type:String,
       required:[true,'please provid password'],
       minilength:8
    },
    verified:{
        default:false
    }
     
},{timestamps:true});

userSchema.pre('save',async function (next) {
    try{
        const hash =await bcrypt.hash(this.password,10)
        this.password=hash
        next();
    }catch(err){
        next(err);
    }
    
})


const userModel = mongoose.model('Users',userSchema)

module.exports=userModel