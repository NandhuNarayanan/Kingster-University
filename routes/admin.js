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
const paymentModel = require('../models/paymentModel');
const quaryModel = require('../models/QueriesModel')
const professorsModel = require('../models/professorsModel')




router.get('/admindash',(req,res)=>{

  res.render('admin/adminDash',{layout:'admin-layout',admin_header:true})
});

//////////////////////////////////////////////_______________________ADD-LOGIN_________________________/////////////////////////////////////////////////////////////


router.get('/',(req,res)=>{
  if(req.session.login){
    res.redirect('/admin/admindash')
  }
  res.render('admin/adminlogin',{layout:'admin-layout'})
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
   res.render('admin/viewStudents',{allStudents,layout:'admin-layout',admin_header:true}).toUpperCase()


  } catch (error) {
    
  }
})


router.get('/addstudents',(req,res)=>{
  res.render('admin/addStudents',{layout:'admin-layout',admin_header:true})
})


//////////////////////////////////////////////_______________________ADD-DEPARTMENT_________________________///////////////////////////////////////////////////////

router.get('/adddepartment',(req,res)=>{
  res.render('admin/addDepartment',{layout:'admin-layout',admin_header:true})
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


//////////////////////////////////////////////_______________________ADD-PROFESSERS_________________________////////////////////////////////////////////////////////


router.get('/addprofessors',async(req,res)=>{
  try {
    const getDepartment = await departmentModel.find().lean()
    res.render('admin/addProfessors',{getDepartment,layout:'admin-layout',admin_header:true})
  } catch (error) {
    console.log(error);
  }
  
})

router.post('/addprofessors',async(req,res)=>{
  try {
    const professors = await new  professorsModel(req.body)
    const qualificationIDUpdate = await departmentModel.findOneAndUpdate(req.body.professors,{$push:{professorsID:professors._id}})
    professors.save()

     res.redirect('/admin/addprofessors')
  
    
  } catch (error) {
    console.log(error);
  }
});



//////////////////////////////////////////////_______________________VIEW-PROFESSORS_________________________////////////////////////////////////////////////////////




router.get('/viewprofessors',async(req,res)=>{
  try {
    const viewprofessors = await professorsModel.find().populate('depatment').lean()
    res.render('admin/viewProfessors',{viewprofessors,layout:'admin-layout',admin_header:true})

  } catch (error) {
    console.log(error);
  }
})









//////////////////////////////////////////////_______________________VIEW-COURSES_________________________////////////////////////////////////////////////////////


router.get('/viewcourse',async(req,res)=>{
  try {
    const viewcourses = await courseModel.find().lean()
    res.render('admin/viewCourses',{viewcourses,layout:'admin-layout',admin_header:true})

  } catch (error) {
    console.log(error);
  }
})


//////////////////////////////////////////////_______________________ADD-COURSES_________________________/////////////////////////////////////////////////////////////


router.get('/addcourse',async(req,res)=>{
  try {
    const getqualificaton = await  qualificationModel.find().lean()
    const getDepartment = await departmentModel.find().lean()
    res.render('admin/addCourse',{getqualificaton,getDepartment,layout:'admin-layout',admin_header:true})
  } catch (error) {
    console.log(error);
  }
  
})


router.post('/addcourse',async(req,res)=>{
  try {
    const qualification = await new  courseModel(req.body)
    const qualificationIDUpdate = await qualificationModel.findOneAndUpdate(req.body.course,{$push:{qualificationID:qualification._id}})
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
    res.render('admin/addPrograms',{getcourse,layout:'admin-layout',admin_header:true})
  } catch (error) {
    console.log(error);
  }
 
})


router.post('/addprograms',async(req,res)=>{
  try {
    const course = await new  programModel(req.body)
    const courseUpdate = await courseModel.findOneAndUpdate(req.body.program,{$push:{courseID:course._id}})
    course.save()
     res.redirect('/admin/addPrograms')
    
  } catch (error) {
    console.log(error);
  }
});



//////////////////////////////////////////////_______________________ADD-QUALIFICATIONS_________________________/////////////////////////////////////////////////////////////


router.get('/addqualification',(req,res)=>{
  res.render('admin/addQualification',{layout:'admin-layout',admin_header:true})
})


router.post('/addqualification',async(req,res)=>{

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
router.get('/paymentDetails',(req,res)=>{
  res.render('admin/paymentDetails',{layout:'admin-layout',admin_header:true})
})

router.post('/paymentDetails',async(req,res)=>{

  try {
    const coupons = await new couponModel(req.body)
    coupons.save()
    setTimeout(myFunc,1000);
  
  function myFunc() {
     res.redirect('/admin/paymentDetails')
  }
    
  } catch (error) {
    console.log(error);
  }
});



router.get('/notificationcontent',(req,res)=>{
  res.render('admin/notification',{layout:'admin-layout',admin_header:true})
});

router.post('/notificationcontent',async(req,res)=>{

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



router.get('/paymenthistory',async(req,res)=>{
  try {
    const paymentHistory = await paymentModel.find().populate('program').lean()
    res.render('admin/paymentHistory',{paymentHistory,layout:'admin-layout',admin_header:true})
  } catch (error) {
    
  }

})

router.get('/studentsQuery',async(req,res)=>{
  try {
    const studentsQuery = await quaryModel.find().populate('userId').lean()
    res.render('admin/studentsQuery',{studentsQuery,layout:'admin-layout',admin_header:true})
  } catch (error) {
    
  }

})


router.get('/queryResponse/:id',async(req,res)=>{
  try {
    const studentsQuery = await quaryModel.findById(req.params.id).lean()
    res.render('admin/queryReplay',{studentsQuery,layout:'admin-layout',admin_header:true})
  } catch (error) {
    
  }

})


router.post('/queryResponse',async(req,res)=>{
  try {
   const updateModal = await quaryModel.findOneAndUpdate({_id:req.body.id},{$set:{replay:req.body.replay}})
    res.redirect('/admin/studentsQuery')
  } catch (error) {
    console.log(error);
  }
})











router.get('/logout',(req,res)=>{
  req.session.login = false
  res.redirect('/admin/login')
})

module.exports=router;

