const mongoose = require('mongoose')


const generalInformationSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    dob: {
        type: Date
    },
    category: {
        type: String
    },
    aadharNumber: {
        type: Number
    },
    photo:{

    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    },
    alternatenumber: {
        type: Number
    },
    whatsappnumber: {
        type: Number
    },
    fatherfname: {
        type: String
    },
    fatherSurename: {
        type: String
    },
    motherfname: {
        type: String
    },
    motherSurename: {
        type: String
    },
    parantsemail: {
        type: String
    },
    parantscontactnumber: {
        type: Number
    }
}, { timestamps: true });

const generalInformationModel = mongoose.model('GeneralInformations',generalInformationSchema)

module.exports = generalInformationModel