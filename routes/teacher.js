const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminModel = require('../models/adminModal')
const userModel = require('../models/userModel')
const teacherModel = require('../models/teacherModel')
const bcrypt = require('bcrypt');
const paymentModel = require('../models/paymentModel');
const departmentModel = require('../models/departmentModel');
const mongoose = require('mongoose');
const attendancesModel = require('../models/attendenceModel');




const verifylogin = (req,res,next)=>{
  if(req.session.teacher) {
    next()
  }else{
  res.redirect('/teacher')
  }
}



//////////////////////////////////////////////_______________________Teacher-SIGNUP/////////////////////////////////////////////////////////////


router.get('/teachersignup',(req,res)=>{
  if(req.session.teacher){
    res.redirect('/teacher/teacherDash')
  }else{

    res.render('teacher/teacherSignup',{layout:'teacher-layout'})
  }
});

router.post('/teachersignup',async(req,res)=>{
  try {
    const oldteacher = await teacherModel.findOne({email:req.body.email})
    if(oldteacher) return res.redirect('/teacher/teachersignup')
    const hash = await bcrypt.hash(req.body.password,10)
    req.body.password = hash
    const newteacher =  new teacherModel(req.body)
    newteacher.save()
    res.redirect('/teacher/teacherDash')
  } catch (error) {
    console.log(error);
  }
})

router.get('/teacherDash',verifylogin,(req,res)=>{

  res.render('teacher/teacherDash',{layout:'teacher-layout',teacher_header:true})
});

//////////////////////////////////////////////_______________________Teacher-LOGIN_________________________/////////////////////////////////////////////////////////////


router.get('/',(req,res)=>{
  if(req.session.teacher){
    res.redirect('/teacher/teacherDash')
  }
  res.render('teacher/teacherLogin',{layout:'teacher-layout'})
})

router.post('/',async(req,res)=>{
 try {
  console.log(req.body.teachername);
  const teacher = await teacherModel.findOne({email:req.body.teachername})
  if(!teacher) return res.render('teacher/teacherLogin',{session:{wrongpassword:'123'},layout:'teacher-layout',teacher_header:true})
  await bcrypt.compare(req.body.password,teacher.password)
  .then(e=>{
    console.log(e,'qwerrtyu');
    if(e) {
      req.session.teacher = true
     return res.redirect('/teacher/teacherDash')
    }
    return res.render('teacher/teacherLogin',{session:{wrongpassword:'123'},layout:'teacher-layout',teacher_header:true})
  })
 } catch (error) {
  
 }
})

//////////////////////////////////////////////_______________________Teacher-Attendence_________________________/////////////////////////////////////////////////////////////

router.get('/attendance',async(req,res)=>{
  try {
    const departments = await departmentModel.find().lean()

    res.render('teacher/attendance',{departments,layout:'teacher-layout',teacher_header:true})
  } catch (error) {
    
  }
})



router.post('/getDepartment',async(req,res)=>{
console.log(req.body,'wwwwwwwwwwwwwwwwwww');
let departmentId=req.body.data
const users = await userModel.aggregate([
  {
    '$lookup': {
      'from': 'paymentdetails', 
      'localField': '_id', 
      'foreignField': 'userId', 
      'as': 'paymentdetails'
    }
  }, {
    '$unwind': {
      'path': '$paymentdetails'
    }
  }, {
    '$lookup': {
      'from': 'programs', 
      'localField': 'paymentdetails.program', 
      'foreignField': '_id', 
      'as': 'programDetails'
    }
  }, {
    '$unwind': {
      'path': '$programDetails'
    }
  }, {
    '$unwind': {
      'path': '$programDetails.course'
    }
  }, {
    '$lookup': {
      'from': 'courses', 
      'localField': 'programDetails.course', 
      'foreignField': '_id', 
      'as': 'course'
    }
  }, {
    '$unwind': {
      'path': '$course'
    }
  }, {
    '$lookup': {
      'from': 'departments', 
      'localField': 'course.department', 
      'foreignField': '_id', 
      'as': 'departmentDetails'
    }
  }, {
    '$unwind': {
      'path': '$departmentDetails'
    }
  }, {
    '$match': {
      'departmentDetails._id': mongoose.Types.ObjectId(departmentId)
    }
  },
  {
    $group:{
      _id: "$_id",
      fname:{"$first":"$fname"},
      lname:{"$first":"$lname"},
      
    }
  }
])
console.log(users)
res.status(200).json({users})

})




router.post('/attendance',async(req,res)=>{
  try {
    let studentAttendence = req.body
    let arr=[];
    var studentAttend;
   for (let index = 0; index < studentAttendence.stdId.length; index++) {
    
      studentAttend={month:req.body.month,date:req.body.date,depatment:req.body.depatment,semester:req.body.semester,studentId:req.body.stdId[index],attendance:req.body.attendenceStatus[index]}
      arr.push(studentAttend)       
    
   }
   await attendancesModel.insertMany(arr)
    res.redirect('/teacher/attendance')
  } catch (error) {
    console.log(error);
  }
})

//////////////////////////////////////////////_______________________Teacher-SHOWATTENDANCE_________________________/////////////////////////////////////////////////////////////

router.get('/showAttendance',async(req, res) => {
  const studentAttendance = await attendancesModel.find().populate('studentId').populate('depatment').lean()
  
  console.log(studentAttendance,'❤️😍😒😒');
  res.render('teacher/showAttendance',{studentAttendance,layout:'teacher-layout',teacher_header:true})
})



//////////////////////////////////////////////_______________________Teacher-AddMARK_________________________/////////////////////////////////////////////////////////////



router.get('/viewStudents',async(req,res)=>{
  try {
    const departments = await departmentModel.find().lean()

    res.render('teacher/markAdd',{departments,layout:'teacher-layout',teacher_header:true})
  } catch (error) {
    
  }
})











router.get('/logout',(req,res)=>{
  req.session.login = false
  res.redirect('/teacher')
})

module.exports=router;

