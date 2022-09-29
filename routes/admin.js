const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminModel = require('../models/adminModal')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const courseModel = require('../models/courseModel');
const programModel = require('../models/programModel');
const qualificationModel = require('../models/qualificationModel');
const { populate } = require('../models/userModel');
const departmentModel = require('../models/departmentModel');
const couponModel = require('../models/couponModel')
const notificationModel = require('../models/notificationModel')


// router.get('/adminsignup',(req,res)=>{
//   res.render('admin/adminSignup')
// });

// router.post('/adminsignup',async(req,res)=>{
//   try {
//     const oldadmin = await adminModel.findOne({email:req.body.email})
//     if(oldadmin) return res.redirect('/adminsignup')
//     const hash = await bcrypt.hash(req.body.password,10)
//     req.body.password = hash
//     const newadmin = await new adminModel(req.body)
//     newadmin.save()
//     res.redirect('/admin/admindash')
//   } catch (error) {
//     console.log(error);
//   }
// })

router.get('/admindash',(req,res)=>{

  res.render('admin/adminDash')
});

//////////////////////////////////////////////_______________________ADD-LOGIN_________________________/////////////////////////////////////////////////////////////


router.get('/',(req,res)=>{
  if(req.session.login){
    res.redirect('/admin/admindash')
  }
  res.render('admin/adminlogin')
})

router.post('/',async(req,res)=>{
 try {
  const admin = await adminModel.findOne({email:req.body.username})
  if(!admin) return res.render('admin/adminlogin',{session:{wrongpassword:'123'}})
  await bcrypt.compare(req.body.password,admin.password)
  .then(e=>{
    if(e) {
      req.session.login = true
     return res.redirect('/admin/admindash')
    }
    return res.render('admin/adminlogin',{session:{wrongpassword:'123'}})
  })
 } catch (error) {
  
 }
})

//////////////////////////////////////////////_______________________VIEW-STUDENTS_________________________/////////////////////////////////////////////////////////////
router.get('/viewstudent',async(req,res)=>{
  try {
    const allStudents = await userModel.find().lean()
   res.render('admin/viewStudents',{allStudents}).toUpperCase()


  } catch (error) {
    
  }
})


router.get('/addstudents',(req,res)=>{
  res.render('admin/addStudents')
})


//////////////////////////////////////////////_______________________ADD-DEPARTMENT_________________________///////////////////////////////////////////////////////

router.get('/adddepartment',(req,res)=>{
  res.render('admin/addDepartment')
})

router.post('/adddepartment',async(req,res)=>{

  try {
    const department = await new departmentModel(req.body)
    department.save()
    setTimeout(myFunc,1000);
  
  function myFunc() {
     res.redirect('/admin/addDepartment')
  }
    
  } catch (error) {
    console.log(error);
  }
});


//////////////////////////////////////////////_______________________VIEW-COURSES_________________________////////////////////////////////////////////////////////


router.get('/viewcourse',async(req,res)=>{
  try {
    const viewcourses = await courseModel.find().lean()
    res.render('admin/viewCourses',{viewcourses})

  } catch (error) {
    console.log(error);
  }
})


//////////////////////////////////////////////_______________________ADD-COURSES_________________________/////////////////////////////////////////////////////////////


router.get('/addcourse',async(req,res)=>{
  try {
    const getqualificaton = await  qualificationModel.find().lean()
    const getDepartment = await departmentModel.find().lean()
    res.render('admin/addCourse',{getqualificaton,getDepartment})
  } catch (error) {
    console.log(error);
  }
  
})


router.post('/addcourse',async(req,res)=>{
  try {
    const qualification = await new  courseModel(req.body)
    const qualificationIDUpdate = await qualificationModel.findOneAndUpdate(req.body.course,{$push:{qualificationID:qualification._id}})
    console.log(qualificationIDUpdate,'update');
    qualification.save()

     res.redirect('/admin/addCourse')
  
    
  } catch (error) {
    console.log(error);
  }
});


//////////////////////////////////////////////_______________________ADD-PROGRAMS_________________________/////////////////////////////////////////////////////////////


router.get('/addprograms',async(req,res)=>{
  try {
    const getcourse = await  courseModel.find().lean()
    res.render('admin/addPrograms',{getcourse})
  } catch (error) {
    console.log(error);
  }
 
})


router.post('/addprograms',async(req,res)=>{
  console.log(req.body);
  try {
    const course = await new  programModel(req.body)
    const courseUpdate = await courseModel.findOneAndUpdate(req.body.program,{$push:{courseID:course._id}})
    console.log(courseUpdate,'courseUpdate');
    course.save()
     res.redirect('/admin/addPrograms')
    
  } catch (error) {
    console.log(error);
  }
});



//////////////////////////////////////////////_______________________ADD-QUALIFICATIONS_________________________/////////////////////////////////////////////////////////////


router.get('/addqualification',(req,res)=>{
  res.render('admin/addQualification')
})


router.post('/addqualification',async(req,res)=>{
  console.log(req.body)

  try {
    const qualifications = await new qualificationModel(req.body)
    qualifications.save()
    setTimeout(myFunc,1000);
  
  function myFunc() {
     res.redirect('/admin/addQualification')
  }
    
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////_______________________ADD-COUPONS_________________________/////////////////////////////////////////////////////////
router.get('/addcoupon',(req,res)=>{
  res.render('admin/addCoupon')
})

router.post('/addcoupon',async(req,res)=>{
  console.log(req.body)

  try {
    const coupons = await new couponModel(req.body)
    coupons.save()
    setTimeout(myFunc,1000);
  
  function myFunc() {
     res.redirect('/admin/addcoupon')
  }
    
  } catch (error) {
    console.log(error);
  }
});



router.get('/notificationcontent',(req,res)=>{
  res.render('admin/notification')
});

router.post('/notificationcontent',async(req,res)=>{
  console.log(req.body)

  try {
    const notification = await new notificationModel(req.body)
    notification.save()
    setTimeout(myFunc,1000);
  
  function myFunc() {
     res.redirect('/admin/notificationcontent')
  }
    
  } catch (error) {
    console.log(error);
  }
});








router.get('/logout',(req,res)=>{
  req.session.login = false
  res.redirect('/admin')
})

module.exports=router;

