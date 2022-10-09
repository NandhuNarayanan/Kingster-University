const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const queriesShema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    urname:{
        type:String
    },
    queryCategory:{
        type:String,
    },
    selectForm:{
        type:String
    },
    message:{
        type:String
    },
    replay:{
        type:String
    }

},{timestamps:true});



const queriesModel = mongoose.model('Queries',queriesShema)

module.exports = queriesModel
