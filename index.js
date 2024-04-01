require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const saltRounds = 10;
const app = express();
console.log(process.env.API_kEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/management_system",{useNewUrlParser:true});

const cashierSchema={
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    iscashier:{type:Boolean,default:true}
}
const cashier=mongoose.model('cashier',cashierSchema)

const admin = new mongoose.Schema({
    email:String,
    password:String
})
const Admin = new mongoose.model("Admin",admin);

const Student=mongoose.model('Student',new mongoose.Schema({
    name:{type: String,
        required: true},
    RegNo:{type: String,
        required: true,
        uppercase: true,
        unique: true},
    email:{type: String,
        required: true,
        unique: true},
    password:{type: String,
        required: true},
    date: {type: Date,
        default: Date.now},
      status:{type:String,
        default:"Not paid",
        enum: ['Not paid', 'paid']},
       reason:{type:String,
       required:true},
       amount:{type:Number,
        default:0}, 
        feestype: {
            type: String,          
        },
          feesamount: {
            type: Number,           
          },
     
}));

app.get("/",function(req,res){
    res.render("home")
})
app.get("/userlogin",function(req,res){
    res.render("userlogin")
})
app.get("/userregister",function(req,res){
    res.render("userregister")
})
app.get("/cashierregister",function(req,res){
    res.render("cashierregister")
})
app.get("/cashier",function(req,res){
    res.render("cashier")
})
app.get("/cashierhome",function(req,res){
    res.render("cashierhome")
})
app.get("/cashierlogin",function(req,res){
    res.render("cashierlogin")
})
app.get("/user",function(req,res){
    res.render("user");
})
app.get("/add",function(req,res){
    res.render("addpayment");
})
app.get("/break",function(req,res){
    res.render("break");
})
app.get("/logout",function(req,res){
    res.render("home");
})
app.get("/students",function(req,res){
    res.render("students");
})
app.get("/edit",function(req,res){
  console.log(user);
    res.render("editProfile",);
})
app.get("/viewone",function(req,res){
    res.render("viewone");
})
app.get("/Profile",function(req,res){
    res.render("profile");
})
app.get("/update",function(req,res){
  res.render("update");
})
app.get("/adminregistration",function(req,res){
    res.render("adminregistration");
})

app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
})
// ===============================================
app.post('/cashier/register',function (req, res, ) {   
  const email = req.body.email;
    cashier.findOne({ email: email })
      .then((exUser) => {
        if (exUser) {
          res.send("email is already taken");
        } else {
          bcrypt.hash(req.body.password, 10)
            .then((hash) => {
              let user = new cashier({
                name: req.body.name,
                email: req.body.email,
                password: hash,
             
              });
              user.save()
                .then((result) => {
                  res.render("cashier");;
                })
                .catch((error) => {
                  res.status(400).send(error.message);
                });
            })
            .catch((error) => {
              res.status(400).send(error.message);
            });
        }
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  })

app.post('/cashier/login',function (req, res, ) {
  const email = req.body.email;
  const password = req.body.password
  cashier.findOne({email:email},function(err,foundUser){
   if(err){
      console.log(err)
   }
   else{
      if(foundUser){
          bcrypt.compare(password,foundUser.password,function(err,result){
              if(result===true){
                  res.render("cashierhome")
              }
          })
      }
   }
})
})
// ==============================================
app.post("/adminregistration",function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
  const newUser = new Admin({
      email:req.body.email,
      password:hash,
      
  })
  newUser.save(function(err){
      if(err){
          console.log(err)
      }
      else{
          res.render("adminhome");
      }
  })
})
})

app.post("/adminlogin",function(req,res){
  const email = req.body.email;
  const password = req.body.password
  Admin.findOne({email:email},function(err,foundUser){
   if(err){
      console.log(err)
   }
   else{
      if(foundUser){
          bcrypt.compare(password,foundUser.password,function(err,result){
              if(result===true){
                  res.render("admin");
              }
          })
      }
   }
})
})


app.post("/userlogin",function(req,res){
  const email = req.body.email;
  const password = req.body.password
  Student.findOne({email:email},function(err,foundUser){
   if(err){
      console.log(err)
   }
    else{
      if(foundUser){
          bcrypt.compare(password,foundUser.password,function(err,result){
              if(result===true){
                  res.render("userhome",{fines:foundUser});
              }
          })
      }
   }
})
})
// ===============================================

app.post("/add",function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
  const newUser = new Student({
      name: req.body.name,
      RegNo: req.body.RegNo,
      Dept:req.body.Dept,
      course: req.body.course,
      Batch: req.body.Batch,
      email:req.body.email, 
      password:hash,
      date: req.body.date,
      reason: req.body.reason,
      amount: req.body.amount,
      status:req.body.enum,
  })
  newUser.save(function(err){
      if(err){
          console.log(err)
      }
      else{
          res.render("addAnother")
      }
  })
})
})

app.post("/fees",function(req,res){    
  let fees=req.body.feestype;
  let feesamount=req.body.fees;
// User.find({}).updateOne({fees:fees}).updateOne({feesamount:feesamount})
Student.updateMany({feestype:fees,feesamount:feesamount})
.then(function (users){
res.render("hodhome")
})
.catch(function (err) {
console.log(err);
});
});
// ===============================================
app.get("/fines", function(req, res) {
    Student.find({}, function(err, fines) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("fines", { Student: fines });
      }
    });
  });

  app.post("/edit",function(req,res){
    const email = res.body.email
    const studentname = res.body.name
    const course = req.body.course
    const password = md5(req.body.password)
       let register=req.body.reg;
        
  Student.findOne({register:register}).updateOne({email:email}).updateOne({password:password}).updateOne({studentname:studentname}).updateOne({course:course})
.then(function (users) {
  res.render("studentmain",{users})
  })
  .catch(function (err) {
    console.log(err);
  });
});

app.post("/update",function(req,res){    
  const reg=req.body.RegNo;
  const fineamount=req.body.amount;
  Student.findOneAndUpdate({ RegNo: reg }, { amount: fineamount }, { new: true })
  .then(function(student) {
    res.render("upd", { Student: [student] });
  })
  .catch(function(err) {
    console.log(err);
  });
});

app.post("/onestudent", function(req, res) {
    const reg=req.body.reg
      Student.find({RegNo:reg})
    .then(function (users) {
      res.render("oneStd",{Student:users})
      })
      .catch(function (err) {
        console.log(err);
      });   
     
    });

    app.get("/userhome", function(req, res) {
      
      const fines = {
          name: "John Doe", // Sample user data
          RegNo: "123456",  // Sample user data
          email: "john@example.com", // Sample user data
          course: "Computer Science" // Sample user data
      };
  
      // Render the 'userhome.ejs' template with the 'fines' data
      res.render("userhome", { fines: fines });
  });
  app.post("/userhome/:id", function(req, res) {
    const userId = req.params.id;

    // Omit 'RegNo' from req.body to prevent accidental updates
    delete req.body.RegNo;

    // Update the user's information in the database
    Student.findByIdAndUpdate(userId, req.body, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send("User not found.");
            }
            res.render("userhome", { fines: updatedUser }); // Pass updated user data to the template
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});



app.listen(8000,function(){
    console.log("server is started at port 8000")
})