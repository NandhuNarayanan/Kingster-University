const mongoose = require('mongoose')


generalInformationSchema = new mongoose.Schema({
    userId: {
        type: String
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
    photograph: {

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

const generalInformationModel = mongoose.model('GeneralInformations', generalInformationSchema)

module.exports = generalInformationModel