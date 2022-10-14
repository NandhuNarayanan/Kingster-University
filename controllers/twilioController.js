const { resolve } = require('promise');
const userModel = require('../models/userModel')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })


// let config = {
//     ServiceSid:'VAfe0f5aae6d21bd04d857d228f692d9a8',
//     accountSID:'AC17531fe16f0e493a3fd0e59c4fe27d77',
//     authToken:'53e78cc6ba9ea1bf525cc7d20098cec3'
// }

// const Client = require('twilio')(config.accountSID,config.authToken);
const Client = require('twilio')(process.env.SID,process.env.TOKEN);


module.exports = {
signupgetotp:(number)=>{
    return new Promise((resolve, reject) => {
         // Client.verify.v2.services(config.ServiceSid).verifications.create({
        Client.verify.v2.services(process.env.SERVICE).verifications.create({       
            to: '+91' + number,
            channel:'sms'
        }).then(data=>{
            resolve(data)
        })
    })
    
},



    getOtp: (number)=>{
        return new Promise(async(resolve, reject) => {
            const user = await userModel.findOne({phonenumber : number});
            const  response = {}
            if (user) {
                response.exist = true;
                if (!user.ActiveStatus) {
                    // Client.verify.v2.services(config.ServiceSid).verifications.create({
                    Client.verify.v2.services(process.env.SERVICE).verifications.create({
                        to: '+91' + number,
                        channel:'sms'
                    })

                        .then((data)=>{
                            response.data = data;
                            response.user = user;
                            response.email = user.email
                            response.ActiveStatus = true;
                            resolve(response)
                        }).catch((err)=>{
                            reject(err)
                        })
                    }
                // else{
                //     response.userBlocked = true;
                //     resolve(response)
                // }
                
            }else{
                response.exist = false
                resolve(response)
            }
        })
    },

    checkOtp:(otp, number)=>{
        let phonenumber = "+91" + number;
        return new Promise((resolve, reject) => {
            // Client.verify.v2.services(config.ServiceSid).verificationChecks.create({
            Client.verify.v2.services(process.env.SERVICE).verificationChecks.create({
                to: phonenumber,
                code: otp,
               
            }).then((verification_check)=>{
                resolve(verification_check.status)

            }).catch((err)=>{
            })
        });
    }
} 