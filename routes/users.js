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
const { findOne, populate, findById } = require('../models/userModel');
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
const generalInformationModel = require('../models/InformationOfgeneralModel')
const qualificationInformationModel = require('../models/InformationOfqualificationModel')
const ProgramOfferedModel = require('../models/ProgramOfferedModel')
const quaryModel = require('../models/QueriesModel');
const departmentModel = require('../models/departmentModel');
const admissionDetailsModel = require('../models/admissionDetailsModel');
const attendanceModel = require('../models/attendenceModel');
const InformationOfgeneralModel = require('../models/InformationOfgeneralModel')
const InformationOfqualificationModel =  require('../models/InformationOfqualificationModel')

const verifylogin = (req,res,next)=>{
  if(req.session.login) {
    next()
  }else{
  res.redirect('/login')
  }
}


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `passportsizeimages/image-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload=multer({storage:multerStorage})



/* GET home page. */
router.get('/',async function(req, res, next) {
  if(req.session.login){
    res.redirect('/studentdash')
  }else{
    const studentCourse = await programModel.aggregate([
      {
        '$lookup': {
          'from': 'courses', 
          'localField': 'course', 
          'foreignField': '_id', 
          'as': 'courseDetals'
        }
      }, {
        '$unwind': {
          'path': '$courseDetals'
        }
      }
    ])
    res.render('users/landingPage',{studentCourse,home_header:true})
  }
  
});

router.get('/programs/:id',async(req,res)=>{
  try {
    const programs = await programModel.findById(req.params.id).populate('course').lean()
    const studentCourse = await programModel.aggregate([
      {
        '$lookup': {
          'from': 'courses', 
          'localField': 'course', 
          'foreignField': '_id', 
          'as': 'courseDetals'
        }
      }, {
        '$unwind': {
          'path': '$courseDetals'
        }
      }
    ])
    res.render('users/courses/program',{studentCourse,programs,home_header:true})
  } catch (error) {
    
  }
});


router.get('/admissions',async(req,res)=>{
  const studentCourse = await programModel.aggregate([
    {
      '$lookup': {
        'from': 'courses', 
        'localField': 'course', 
        'foreignField': '_id', 
        'as': 'courseDetals'
      }
    }, {
      '$unwind': {
        'path': '$courseDetals'
      }
    }
  ])
  res.render('users/admissions',{studentCourse,home_header:true})
});

router.get('/course',async(req,res)=>{
  const viewcourses = await courseModel.find().lean()
  const studentCourse = await programModel.aggregate([
    {
      '$lookup': {
        'from': 'courses', 
        'localField': 'course', 
        'foreignField': '_id', 
        'as': 'courseDetals'
      }
    }, {
      '$unwind': {
        'path': '$courseDetals'
      }
    }
  ])
 
  res.render('users/courses/course',{studentCourse,home_header:true,viewcourses})
});

router.get('/courses/:id',async(req,res)=>{
  const viewcourses = await courseModel.findById(req.params.id).lean()
  const studentCourse = await programModel.aggregate([
    {
      '$lookup': {
        'from': 'courses', 
        'localField': 'course', 
        'foreignField': '_id', 
        'as': 'courseDetals'
      }
    }, {
      '$unwind': {
        'path': '$courseDetals'
      }
    }
  ])
  res.render('users/courses/course1',{studentCourse,viewcourses,home_header:true})
});


router.get('/aboutus',async(req,res)=>{
  const studentCourse = await programModel.aggregate([
    {
      '$lookup': {
        'from': 'courses', 
        'localField': 'course', 
        'foreignField': '_id', 
        'as': 'courseDetals'
      }
    }, {
      '$unwind': {
        'path': '$courseDetals'
      }
    }
  ])
  res.render('users/aboutUs',{studentCourse,home_header:true})
})


router.get('/universityLife',async(req,res)=>{
  const studentCourse = await programModel.aggregate([
    {
      '$lookup': {
        'from': 'courses', 
        'localField': 'course', 
        'foreignField': '_id', 
        'as': 'courseDetals'
      }
    }, {
      '$unwind': {
        'path': '$courseDetals'
      }
    }
  ])
  res.render('users/universityLife',{studentCourse,home_header:true})
})


////////////////////////////////_______login section_______////////////////////////////////////

router.get('/login',(req,res)=>{
  if (req.session.login) {
    res.redirect('/')
  }else{
    res.render('users/loginUsers',{home_header:true})
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

router.get('/signup',async(req, res, next)=> {  
if (req.session.login) {
  res.redirect('/')
}else{
  const qualification = await qualificationModel.find().lean()
  const course = await courseModel.find().lean()
  res.render('users/signupUsers',{qualification,course})

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

    console.log(error);
 }   
  });
/////////////////////////////////_____________________________________________///////////////////////////////////

//////////////////////////////////// _______SIGNUP OTP VERYFING_______ /////////////////////////////////////////
router.get('/signupotp',(req,res)=>{
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
       const viewqualification = await qualificationModel.find().lean()
      const viewcourses = await courseModel.find().lean()
      const viewprogram = await programModel.find().lean()
      const notification = await notificationModel.find().lean()
      const user =  await userModel.findById(req.session.user._id).lean()
      const applyedProgram = await paymentModel.find({userId:req.session.user._id}).populate('program').populate('course').lean()
      res.render('users/studentDash',{user,viewqualification,viewcourses,viewprogram,notification,applyedProgram,layout:'student-layout',student_header:true})
     } catch (error) {
      console.log(error);
    }
  });


  router.get('/studentprofile',verifylogin,async(req,res,next)=>{
    const user =  await userModel.findById(req.session.user._id).lean()
    const notification = await notificationModel.find().lean()
    res.render('users/student_profile',{user,invalid:req.session.invaild,notification,layout:'student-layout',student_header:true})

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

  router.get('/otp',(req,res)=>{
    res.render('users/otpvrfy')
  });

  router.post('/otpget',async(req,res)=>{
    try {
      const existuser = await userModel.findOne({mobile:req.body.phonenumber})
      if (existuser) {
        req.session.phonenumber = req.body.phonenumber
        twilioController.getOtp(req.body.phonenumber).then((response)=>{
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
      }else{
        res.redirect('/login')
      }
    } catch (error) {
      
    }
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
    const userId = await userModel.findById(req.session.user._id)
    res.render('users/studentApplication',{viewqualification,viewcourses,viewprogram,notification,layout:'student-layout',student_header:true})
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
        viewprogram =  await programModel.find({$in:{course: id}}).lean()
        // viewprogram.forEach(element => {
        //   element._id = element._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        //   programIds.push(element._id);
        //  });  
        
 
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
  res.render('users/studentsHelp',{layout:'student-layout',student_header:true})
});






router.get('/notification',verifylogin,async(req,res)=>{
  try {
    const notification = await notificationModel.find().lean()
    res.render('users/studentNotification',{notification,layout:'student-layout',student_header:true})
  } catch (error) {
    
  }
});



//////////////////////////////////////______APPLY_APPLICATION_______//////////////////////////////////////

////////---------------------Personal_Details

router.get('/personalform',verifylogin,async(req,res)=>{
  try {
    const olduser = await applicationModel.findOne({userId:req.session.user._id})
    
    if (!olduser) {
    const users = await userModel.findById(req.session.user._id).lean()
    const applyedProgram = await programModel.find(req.query._id).lean()
    const applyDetails = new applicationModel({userId:req.session.user._id,program:req.query.id})
    applyDetails.save()
    const notification = await notificationModel.find().lean()
    res.render('users/personalDetailsForm',{programName:applyedProgram.program,users,notification})
  }else{
    res.redirect('/application')
  }
  } catch (error) {
    console.log(error);
  }
});




router.post('/personalform',upload.single("photograph"),async(req,res)=>{
 try {
   let photograph = req.file
   req.body.photograph = photograph

   const userDetailes = await new personalDetailsModel(  {userId:req.session.user._id,
    applyingCourse:req.query.id,
photograph:req.body.photograph,
salutaton: req.body.salutaton,
fname: req.body.fname,
lname: req.body.lname,

gender:req.body.gender,
dob: req.body.dob,
bloodgroup:req.body.bloodgroup,
maritalstatus:req.body.maritalstatus,
age: req.body.age,
category:req.body.category,
nationality:req.body.nationality,
differentlyabled: req.body.differentlyabled,
idproof: req.body.idproof,
mobilenumber: req.body.mobilenumber,
alternatenumber: req.body.alternatenumber,
primeryemail: req.body.primeryemail,
alternateemail:req.body.alternateemail,
fathertitle: req.body.fathertitle,
fatherfname:req.body.fatherfname,
fatherlname: req.body.fatherlname,
fathermobilenumber: req.body.fathermobilenumber,
fatheremail: req.body.fatheremail,
motheretitle: req.body.motheretitle,
motherfname: req.body.motherfname,
motherlname: req.body.motherlname,
mothermobilenumber: req.body.mothermobilenumber,
motheremail: req.body.motheremail,
country:req.body.country,
state: req.body.state,
city: req.body.city,
address1: req.body.address1,
address2: req.body.address2,
pincode: req.body.pincode})

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
  res.render('users/academicDetailsForm',{notification,layout:'student-layout',student_header:true})
  } catch (error) {
    console.log(error);
  }
});

router.post('/academicform',async(req,res)=>{
  try {
    const academicDetails = await new academicDetailsModel({
      userId :req.session.user._id,
      XBoard:req.body.XBoard,
     ExaminationState:req.body.ExaminationState,
     SchoolName:req.body.SchoolName,
  
     XDetails:req.body.XDetails,
      XIIorDiploma:req.body.XIIorDiploma,
      XIIStatus:req.body.XIIStatus,
      XIIExaminationState:req.body.XIIExaminationState,
      XIISchoolName:req.body.XIISchoolName,
      XIIDetails:req.body.XIIDetails,
      reference:req.body.reference,
      Program1:req.body.Program1,
      Program2:req.body.Program2,
  })

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
    res.render('users/studentPayment',{notification,payDetailes,fee:fee.program.applicationFee,kit:fee.program.kitAmount})
  } catch (error) {
    console.log(error);
  }
});


////////---------------------PAYMENT_ID
router.post('/makepayment',async(req,res)=>{  
  try {
    const findProgram = await applicationModel.findOne({userId:req.session.user._id}).populate('program').lean()
    console.log(req.body.Grandtotal,"jjjjjj");
    const finalPayment = await new paymentModel({finalAmount:req.body.Grandtotal,userId:req.session.user._id,program:findProgram.program})
    
    finalPayment.save()
    console.log(finalPayment,"lllll");
    paymentController.generateRazorpay(finalPayment).then((response)=>{
      console.log(response,"response");
    res.json(response)
    })
  } catch (error) {
    console.log(error);
  }
})

////////---------------------verify_PAYMENT
router.post('/verifyPayment',(req,res)=>{
  console.log(req.body,"kkkkkkkk");
  paymentController.verifyPayment(req.body).then(()=>{
    paymentController.changePaymentStatus(req.body.receipt).then(()=>{
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
    const paymentHistory = await paymentModel.find({userId:req.session.user._id}).populate('program').populate('course').lean()
    res.render('users/studentPayhistory',{paymentHistory,layout:'student-layout',student_header:true})
  } catch (error) {
   console.log(error);
  }
});


router.get('/generalInformation',verifylogin,async(req,res)=>{
  try {
    
    const olduser = await applicationModel.findOne({userId:req.session.user._id})
    if(!olduser){
      const admissionDetails = new admissionDetailsModel({userId:req.session.user._id,program:req.query.id})
        admissionDetails.save()
      res.render('users/generalInformation',{layout:'student-layout',student_header:true})
    }else{
      res.redirect('/application')
    }

  } catch (error) {
    
  }
})

let photo = upload.single("photo")
router.post('/generalInformation',photo,(req,res)=>{
  try {
    let image = req.file
    req.body.photo = image

    const generalInformation = new generalInformationModel({userId:req.session.user._id,
      program:req.query.id,
    dob:req.body.dob,
    category:req.body.category,
    aadharNumber:req.body.aadharNumber,
    photo:req.body.photo,
    address1:req.body.address1,
    address2:req.body.address2,
    country:req.body.country,
    state:req.body.state,
    city:req.body.city,
    pincode:req.body.pincode,
    alternatenumber:req.body.alternatenumber,
    whatsappnumber:req.body.whatsappnumber,
    fatherfname:req.body.fatherfname,
    fatherSurename:req.body.fatherSurename,
    motherfname:req.body.motherfname,
    motherSurename:req.body.motherSurename,
    parantsemail:req.body.parantsemail,
    parantscontactnumber:req.body.parantscontactnumber
    })
    generalInformation.save()
    res.redirect('/qualificationInformation')
  } catch (error) {
    console.log(error);
  }
})




router.get('/qualificationInformation',(req,res)=>{
  try {
    res.render('users/qualificationInformation',{layout:'student-layout',student_header:true})
  } catch (error) {
    console.log(error);
  }
})

router.post('/qualificationInformation',upload.single("document"),(req,res)=>{
  try {
    let image = req.file
    req.body.qualificationDocumentOftenth = image
    let doc = req.file
    req.body.qualificationDocumentOfPlustwo = doc

    const qualificationInformation = new qualificationInformationModel({userId:req.session.user._id,
      tenthDetails:req.body.tenthDetails,
     qualificationDocumentOftenth:req.body.qualificationDocumentOftenth,
     tenthSchoolState:req.body.tenthSchoolState,
     tenthSchoolDistrict:req.body.tenthSchoolDistrict,
      tenthSchoolCity:req.body.tenthSchoolCity,
      tenthSchoolName:req.body.tenthSchoolName,
      tenthBoard:req.body.tenthBoard,
      plustwoDetails:req.body.plustwoDetails,
      qualificationDocumentOfPlustwo:req.body.qualificationDocumentOfPlustwo,
      plustwoSchoolState:req.body.plustwoSchoolState,
      plustwoSchoolDistrict:req.body.plustwoSchoolDistrict,
      plustwoSchoolCity:req.body.plustwoSchoolCity,
      plustwoSchoolName:req.body.plustwoSchoolName,
      plustwoBoard:req.body.plustwoBoard})
    qualificationInformation.save()
    res.redirect('/ProgramsOffered')
  } catch (error) {
    console.log(error);
  }
})


router.get('/ProgramsOffered',async(req,res)=>{
  try {
    const programDetails = await courseModel.find().lean();

    res.render('users/ProgramOffered',{programDetails})
  } catch (error) {
    console.log(error);
  }
})

router.post('/ProgramOffered',async(req,res)=>{
const course = await courseModel.findById(req.body.courseid)
const courseName = course.course
const coursePrice = course.price
res.json({courseName,coursePrice})
})

router.post('/ProgramOffered/makePayment',(req,res)=>{
  try {
    const {course,amountPayable} = req.body
    const makePayment = new ProgramOfferedModel({amountPayable,course,userId:req.session.user._id})
    makePayment.save()
    res.redirect('/admissionPayment')
  } catch (error) {
    console.log(error);
  }
})
  





router.get('/admissionPayment',async(req,res)=>{
  try {
    const payableAmount = await ProgramOfferedModel.findOne({userId:req.session.user._id}).populate('userId').lean()
    res.render('users/takeACoursePayment',{payableAmount,fee:payableAmount.amountPayable,username:payableAmount.userId.fname,lastname:payableAmount.userId.lname,email:payableAmount.userId.email,phone:payableAmount.userId.mobile})
  } catch (error) {
    console.log(error);
  }
})

////////---------------------PAYMENT_ID
router.post('/payamount',async(req,res)=>{  
  try {
    const findCourse = await ProgramOfferedModel.findOne({userId:req.session.user._id}).lean()
    const finalPayment = await new paymentModel({finalAmount:req.body.totalFee,userId:req.session.user._id,course:findCourse.course})
    finalPayment.save()
    paymentController.generateRazorpay(finalPayment).then((response)=>{
    res.json(response)
    })
  } catch (error) {
    console.log(error);
  }
})

////////---------------------verify_PAYMENT
router.post('/Paymentverify',(req,res)=>{
  paymentController.verifyPayment(req.body).then(()=>{
    paymentController.changePaymentStatus(req.body.receipt).then(()=>{
      res.json({status:true})
    })
  }).catch((error)=>{
    console.log(error);
    res.json({status:false})
  })
})




router.get('/invoice/:id',verifylogin,async(req,res)=>{
  try {
    const invocePayment = await paymentModel.findById(req.params.id).populate('program').populate('userId').populate('course').lean()
    const notification = await notificationModel.find().lean()
    res.render('users/student-invoice',{notification,invocePayment,layout:'student-layout',student_header:true})
  } catch (error) {
    console.log(error);
  }
})




router.get('/quary',verifylogin,async(req,res)=>{
  try {
    const showquery = await quaryModel.find().populate('userId').lean()
    res.render('users/quary',{showquery,layout:'student-layout',student_header:true})
  } catch (error) {
    
  }
});


router.post('/getquery',(req,res)=>{
  try {
    const askQuary = new quaryModel(req.body)
    askQuary.save()
  res.json('success')
  } catch (error) {
    console.log(error);
  }
})



router.get('/quaryDetails/:id',verifylogin,async(req,res)=>{
  try {
    const studentsQuery = await quaryModel.findById(req.params.id).lean()
    const showquery = await quaryModel.find().populate('userId').lean()
    res.render('users/queryDetails',{studentsQuery,showquery,layout:'student-layout',student_header:true})
  } catch (error) {
    
  }
});

router.get('/showStudentAttendance',async(req,res)=>{
  const showAttendance = await attendanceModel.find({studentId:req.session.user._id}).lean()
  res.render('users/showStudentAttendance',{showAttendance,layout:'student-layout',student_header:true})
})




router.get('/success',(req,res)=>{
  res.render('users/successPage')
})

router.get('/paymentsuccess',(req,res)=>{
  res.render('users/paymentsuccesspage')
})

router.get('/failed',(req,res)=>{
  res.render('users/FailedPage')
})



router.get('/getApplicationForm',async(req,res)=>{
  const ApplicationDetails = await personalDetailsModel.find({userId:req.session.user._id}).lean()
  const ApplicationDetails2= await academicDetailsModel.find({userId:req.session.user._id}).lean()
  res.render('users/getApplicationDetails',{ApplicationDetails2,ApplicationDetails,layout:'student-layout'})
})


router.get('/getTakeadmissionForm',async(req,res)=>{
  const AdmissionDetails = await InformationOfgeneralModel.find({userId:req.session.user._id}).lean()
  const AdmissionDetails2= await InformationOfqualificationModel.find({userId:req.session.user._id}).lean()
  res.render('users/getTakeAdmission',{AdmissionDetails,AdmissionDetails2,layout:'student-layout'})
})
//////////////////////////////////////______logout_______//////////////////////////////////////

  router.get('/logout',(req,res)=>{
    req.session.login = false
    res.redirect('/login')
  });




module.exports = router; 
