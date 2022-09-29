const mongoose = require('mongoose')


personalDetailsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    photograph: {

    },
    salutaton: {
        type: String
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },

    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    bloodgroup: {
        type: String
    },
    maritalstatus: {
        type: String
    },
    age: {
        type: Number
    },
    category: {
        type: String
    },
    nationality: {
        type: String
    },
    differentlyabled: {
        type: String
    },
    idproof: {
        type: String
    },
    mobilenumber: {
        type: Number
    },
    alternatenumber: {
        type: Number
    },
    primeryemail: {
        type: String
    },
    alternateemail: {
        type: String
    },
    fathertitle: {
        type: String
    },
    fatherfname: {
        type: String
    },
    fatherlname: {
        type: String
    },
    fathermobilenumber: {
        type: String
    },
    fatheremail: {
        type: String
    },
    motheretitle: {
        type: String
    },
    motherfname: {
        type: String
    },
    motherlname: {
        type: String
    },
    mothermobilenumber: {
        type: Number
    },
    motheremail: {
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
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    pincode: {
        type: Number
    }


}, { timestamps: true });

const personalDetailsModel = mongoose.model('personalDetails', personalDetailsSchema)

module.exports = personalDetailsModel