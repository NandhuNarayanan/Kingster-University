const express = require('express');
const session = require('express-session');
const paymentController = require('../controllers/payment-controller');
const router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const mongoose =require('mongoose')
const twilio = require('../controllers/twilioController');
const twilioController = require('../controllers/twilioController');
const { response } = require('../app');
const { findOne, populate } = require('../models/userModel');
const courseModel = require('../models/courseModel')
const programModel = require('../models/programModel');
const qualificationModel = require('../models/qualificationModel');
const personalDetailsModel = require ('../models/personalDetailsModel')
const academicDetailsModel = require ('../models/academicDetailsModel')
const ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
const notificationModel = require('../models/notificationModel');
const applicationModel = require('../models/applicationModel');
const paymentModel = require('../models/paymentModel');



const verifylogin = (req,res,next)=>{
  if(req.session.login) {
    next()
  }else{
  res.redirect('/login')
  }
}


const multerStorage = multer.diskStorage({
  destination: "public/passportsizeimages",
  filename: (req, file, cb) => {
    cb(null,Date.now()+'--'+file.originalname);
  },
});

const Uploads = multer({
  multerStorage
});



/* GET home page. */
router.get('/',function(req, res, next) {
  if(req.session.login){
    res.redirect('/studentdash')
  }else{
    res.render('users/landingPage')
  }
  
});


router.get('/admissions',(req,res)=>{
  res.render('users/admissions')
});


////////////////////////////////_______login section_______////////////////////////////////////

router.get('/login',(req,res)=>{
  if (req.session.login) {
    res.redirect('/')
  }else{
    res.render('users/loginUsers')
  }
});

router.post('/login',async(req,res)=>{
  try {
    const user = await userModel.findOne({email:req.body.username})
    if (!user) return res.render('users/loginUsers',{session:{wrongpassword:"fjnc"}})
       await bcrypt.compare(req.body.password,user.password)
      .then(e=>{
        if (e) {
          req.session.login = true;
          req.session.user = user;
          return res.redirect('/studentdash')
        }

        return res.render('users/loginUsers',{session:{wrongpassword:"fjnc"}})

      })
    
    
  } catch (error) {
  }
 
});
//////////////////////////______________________________________________/////////////////////////

////////////////////////////////_______signup section_______////////////////////////////////////

router.get('/signup', (req, res, next)=> {  
if (req.session.login) {
  res.redirect('/')
}else{
  res.render('users/signupUsers')

}
  
  });

  router.post('/signup',async(req,res)=>{
 try {
    const olduser = await userModel.findOne({email:req.body.email})

  if (olduser) return res.redirect('/signup')
 
  req.session.phonenumber = req.body.mobile
  twilioController.signupgetotp(req.body.mobile)


  const newUser = await new userModel(req.body)
   newUser.save()
   return res.redirect('/signupotp')

 } catch (error) {
    
 }   
  });
/////////////////////////////////_____________________________________________///////////////////////////////////

//////////////////////////////////// _______SIGNUP OTP VERYFING_______ /////////////////////////////////////////
router.get('/signupotp',verifylogin,(req,res)=>{
  res.render('users/signup_otp_verify')
});

router.post('/signupverify',(req,res)=>{
  twilioController.checkOtp(req.body.otp,req.session.phonenumber).then((response)=>{
    if(response == 'approved'){
      userModel.findOneAndUpdate({mobile:req.session.phonenumber},{$set:{verified:true}})
      res.redirect('/studentdash')
    }else{
      res.redirect('/signup')
    }
  })

});


/////////////////////////////__________________________________________//////////////////////////////////////


  router.get('/studentdash',verifylogin,async(req,res)=>{
    try {
      // console.log(req.query)
      // const {qualification,course,program}= req.query
       const viewqualification = await qualificationModel.find().lean()
      const viewcourses = await courseModel.find().lean() ;
      const viewprogram = await programModel.find().lean()
      const notification = await notificationModel.find().lean()
      const applyedProgram = await paymentModel.find({userId:req.session.user._id}).populate('program').lean()
      res.render('users/studentDash',{viewqualification,viewcourses,viewprogram,notification,applyedProgram})
     } catch (error) {
      console.log(error);
    }
  });


  router.get('/studentprofile',verifylogin,async(req,res,next)=>{
    const user =  await userModel.findById(req.session.user._id).lean()
    const notification = await notificationModel.find().lean()
    res.render('users/student_profile',{user,invalid:req.session.invaild,notification})

  });

  router.post('/studentprofile/changepassword',async(req,res,next) =>{
    const user = await userModel.findById(req.body.stdid)
    bcrypt.compare(req.body.crrtPassword,user.password).then(async (data)=>{
      if (data){
        req.session.invaild = false
         await bcrypt.hash(req.body.password,10).then(async hash=>{
           await userModel.findByIdAndUpdate(req.body.stdid,{$set:{password:hash}})
 res.redirect('/studentprofile')
           })
          }else{
req.session.invaild = true
            res.redirect('/studentprofile')
          }
          
  })

});



  //////////////////////////////////// _______OTP_______ /////////////////////////////////////////

  router.get('/otp',verifylogin,(req,res)=>{
    res.render('users/otpvrfy')
  });

  router.post('/otpget',(req,res)=>{
    req.session.phonenumber = req.body.phonenumber
    twilioController.getOtp(req.body.phonenumber).then((response)=>{
      // console.log(response);
      if (response.exist) {
        if (response.ActiveStatus) {
          req.session.user = response.user
          req.session.email = response.email
          res.redirect('otp')
        }
        else{
          req.session.usernotfound = true
          res.redirect('/login')
        }
      }
    })
  });

//////////////////////////////////// _______OTP VERYFING_______ /////////////////////////////////////////


router.post('/otpverify',(req,res)=>{
  twilioController.checkOtp(req.body.otp,req.session.phonenumber).then((response)=>{
    if (response == 'approved') {
      req.session.login = true
      res.redirect('/studentdash')
      
    }else{
      res.redirect('/otp')
    }
  })
  
});






router.get('/application',verifylogin,async(req,res)=>{
  try {
     const viewqualification = await qualificationModel.find().lean()
    const viewcourses = await courseModel.find().lean() ;
    const viewprogram = await programModel.find().lean()
    const notification = await notificationModel.find().lean()
    const userId = await userModel.findById(req.session._id)
    res.render('users/studentApplication',{viewqualification,viewcourses,viewprogram,notification})
   } catch (error) {
    console.log(error);
  }
});

router.post('/application',async(req,res)=>{
  try {
    let status, id, viewcourses, viewprogram, courseIds = [] ,programIds = [];
    'qualification' in req.body ? status = 1 : status = 2;
    if(status === 1){
       id = req.body.qualification;
       viewcourses  = await courseModel.find({qualification : id}).lean();
       viewcourses.forEach(element => {
        element._id = element._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        courseIds.push(element._id);
       });
       console.log("courseIds",courseIds)
        viewprogram =  await programModel.find({$in:{course: id}}).lean()
        // viewprogram.forEach(element => {
        //   element._id = element._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        //   programIds.push(element._id);
        //  });  
        console.log('viewprogram',viewprogram)
 
    }
    else{
      id = req.body.program;
      viewprogram = await programModel.find({course : id}).lean()
    } 
      const getAllprogram = [{qualification : id,course : id,program : id}]


    res.json({viewcourses,viewprogram,getAllprogram})
  } catch (error) {
    console.log(error);
  }
});



router.get('/help',verifylogin,(req,res)=>{
  res.render('users/studentsHelp')
});






router.get('/notification',verifylogin,async(req,res)=>{
  try {
    const notification = await notificationModel.find().lean()
    res.render('users/studentNotification',{notification})
  } catch (error) {
    
  }
});



//////////////////////////////////////______APPLY_APPLICATION_______//////////////////////////////////////

////////---------------------Personal_Details

router.get('/personalform',verifylogin,async(req,res)=>{
  console.log('query',req.query)
  try {
    const olduser = await applicationModel.findOne({userId:req.session.user._id})
    
    if (!olduser) {
    const users = await userModel.findById(req.session.user._id).lean()
    const applyDetails = await new applicationModel({userId:req.session.user._id,program:req.query.id})
    applyDetails.save()
    const selectedProgram = await applicationModel.find({userId:req.session.user._id}).populate('program').lean()
    const notification = await notificationModel.find().lean()
    console.log('selectedProgram',selectedProgram);
    res.render('users/personalDetailsForm',{users,selectedProgram,notification})
  }else{
    res.redirect('/application')
  }
  } catch (error) {
    console.log(error);
  }
});

router.post('/personalform',Uploads.single("photograph"),async(req,res)=>{
 try {
   let photograph = req.file
   req.body.photograph = photograph
   const userDetailes = await new personalDetailsModel(req.body)
   userDetailes.save()
   res.redirect('/academicform')
 } catch (error) {
  console.log(error);
 }
});

////////---------------------END Personal_Details

////////---------------------Academic_Details


router.get('/academicform',verifylogin,async(req,res)=>{
  try {
    const notification = await notificationModel.find().lean()
  res.render('users/academicDetailsForm',{notification})
  } catch (error) {
    console.log(error);
  }
});

router.post('/academicform',async(req,res)=>{
  console.log(req.body);
  try {
    req.body.userId = session.user;
    const academicDetails = await new academicDetailsModel(req.body)
    academicDetails.save()
    res.redirect('/payment')
  } catch (error) {
    console.log(error);
  }
});

/////////////////////////////__________________________________________//////////////////////////////////////


//////////////////////////////////////______APPLY_APPLICATION_______//////////////////////////////////////

router.get('/payment',verifylogin,async(req,res)=>{
  try {
    const payDetailes = await userModel.findById(req.session.user._id).lean()
    const fee = await applicationModel.findOne({userId:req.session.user._id}).populate('program').lean()
    const notification = await notificationModel.find().lean()
    res.render('users/studentPayment',{payDetailes,fee:fee.program.applicationFee,kit:fee.program.kitAmount,notification})
  } catch (error) {
    console.log(error);
  }
});


////////---------------------PAYMENT_ID
router.post('/makepayment',async(req,res)=>{  
  try {
    const findProgram = await applicationModel.findOne({userId:req.session.user._id}).populate('program').lean()
    const finalPayment = await new paymentModel({finalAmount:req.body.Grandtotal,userId:req.session.user._id,program:findProgram.program})
    finalPayment.save()
    console.log(finalPayment,'qwerty');
    paymentController.generateRazorpay(finalPayment).then((response)=>{
    res.json(response)
    })
  } catch (error) {
    console.log(error);
  }
})

////////---------------------verify_PAYMENT
router.post('/verifyPayment',(req,res)=>{
  console.log(req.body,"req.body");
  paymentController.verifyPayment(req.body).then(()=>{
    console.log(req.body,'in verify ');
    paymentController.changePaymentStatus(req.body.receipt).then(()=>{
      console.log('Payment Successfull');
      res.json({status:true})
    })
  }).catch((error)=>{
    console.log(error);
    res.json({status:false})
  })
})




////////---------------------KUNEST_KIT
router.post('/applyKit',async(req,res)=>{
  try {
    const Applykit = await applicationModel.findOne({userId:req.session.user._id}).populate('program').lean()
      res.json({Applykit})
  } catch (error) {
    console.log(error);
  }
})

/////////////////////////////__________________________________________//////////////////////////////////////




router.get('/history',verifylogin,async(req,res)=>{
  try {
    const paymentHistory = await paymentModel.find({userId:req.session.user._id}).populate('program').lean()
    res.render('users/studentPayhistory',{paymentHistory})
  } catch (error) {
    // {program:paymentHistory.program.program,Amount:paymentHistory.finalAmount,paymentStatus:paymentHistory.paymentStatus}
  }
});




//////////////////////////////////////______logout_______//////////////////////////////////////

  router.get('/logout',(req,res)=>{
    req.session.login = false
    res.redirect('/login')
  });




module.exports = router; 
