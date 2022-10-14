const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const { resolve } = require('promise')
const Razorpay = require('razorpay');
const paymentModel = require('../models/paymentModel');
const { response } = require('../app');

const dotenv = require('dotenv')
dotenv.config();

var instance = new Razorpay({
  // key_id: 'rzp_test_GLNe9qeA5buuYT',
  
  // KEY_SECRET: 'SUqfWZw3WabfeQuNY90sbRv3',
  key_id:process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

module.exports={     
generateRazorpay:(finalPayment)=>{
  console.log(finalPayment.finalAmount,"hhhhhh");
    return new Promise((resolve, reject) => {
      var options = {
        amount: finalPayment.finalAmount*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: ''+finalPayment._id
      };
      instance.orders.create(options, function(err, order) {
        console.log(options,"order");
        resolve(options)
      });
    })
},
verifyPayment:(details)=>{
  return new Promise((resolve, reject) => {
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256',process.env.KEY_SECRET)
    hmac.update(details.Payment.razorpay_order_id+'|'+details.Payment.razorpay_payment_id); 
    hmac = hmac.digest('hex')
    if(hmac==details.Payment.razorpay_signature){
      resolve()
    }else{
      reject()
    }
  })
},
changePaymentStatus:(orderId)=>{
  return new Promise(async(resolve, reject) => {
    try {
       await paymentModel.findOneAndUpdate({id:orderId},{$set:{OrderStatus:true,paymentStatus:"success"}}).then((response)=>{
        console.log(response,'paymentUpdate');
        resolve(response)
      })
    } catch (error) {
      reject(error )
    }
  })
}


}