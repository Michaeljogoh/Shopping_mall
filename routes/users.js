const express = require('express'),
User = require("../model/Users"),
 app = express();
 router = express.Router();
 const bcrypt = require('bcrypt');
 const passport = require('passport');
 const nodemailer = require('nodemailer');
 




 router.get('/register', (req,res)=>{
    res.render("register")
});

// step 1
let transporter = nodemailer.createTransport({      
    service: 'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
});

router.post("/register", (req,res)=>{
    const {name, email, password, password2, date}= req.body;
    let errors = [];
 
    
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"})
    }
 
    if(password !== password2){
        errors.push({msg:"Passwords do not match"})
    }
 
    if(password< 6){
        errors.push({msg:"Password must not be less than six characters"})
    }
 
    if(errors.length>0){
     res.render('register',{
         errors,
         name,
         email,
         password,
         password2
     });
    }else{
        //Validation() passed
        User.findOne({email:email})
        .then(user =>{
            if(user){
                //User exists
                errors.push({msg:'Email is already registered'})
                res.render('register',{
                 errors,
                 name,
                 email,
                 password,
                 password2
             });
 
            }else{
 
             const newUser = new User({name, email, password,date});
             
            
             //Hash Password
 
             bcrypt.genSalt(10, (err,salt)=>
                 bcrypt.hash(newUser.password, salt, (err,hash)=>{
                     if(err) throw err;
                  
                     newUser.password = hash;
                     
                     //save user
 
                     newUser.save()
                     .then(user => {
                         //req.flash('success_msg', 'You are now registered and can log in')
                         res.redirect('login')
                     })
                     .catch(err => console.log(err));
             }))
 
            }
        });
    }   
 });

//  update profile
 router.get('/update', (req, res)=>{
    let name = req.user.name;
    let email = req.user.email;
    let password = req.user.password;
    if(req.user){
        res.render('update',{
            name,
            email
        })
    } else {

       req.flash('errors_msg', 'Please log in again to update')
        
        res.status(400).render('updated')
    }



     res.render('update',{
         name,
         email,
         
     })
});

    router.post("/update", (req,res)=>{
   const {name, email, password, password2, date}= req.body;
    let errors = [];
 
    
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"})
    }
 
    if(password !== password2){
        errors.push({msg:"Passwords do not match"})
    }
 
    if(password< 6){
        errors.push({msg:"Password must not be less than six characters"})
    }
 
    if(errors.length>0){
     res.render('update',{
         errors,
            name,
         email,
         password,
         password2
     });
    }else{
        //Validation passed
        User.findOne({email:email})
        .then(user =>{
            if(!user){
                //User exists
                errors.push({msg:'Email is already registered'})
                res.render('register',{
                 errors,
                 name,
                 email,
                 password,
                 password2
             });
 
            }else{

                User.deleteOne({email:email}, function(err){
                    if(err){
                        console.log("failed to delete" + err)
                    } else {
                        console.log("user deleted")
                    }
                })
 
             const newUser = new User({name, email, password,date});


        // step 2
        let mailOptions = {       

            from:'mykaeljogoh@gmail.com',
            to:email,
            cc:'peterdamfin@gmail.com',
            subject: 'Testing my email servicce',
            text: '<html><h1>Thank You For Shopping With U</h1></html>. please kindly Click',
        
            }

                     // step 3
transporter.sendMail(mailOptions, function(err, data){
    if(err){
        console.log('There was an error sending the mail.' + err)
    } else {
        console.log('Email Sent')
    }
});
            
             //Hash Password
 
             bcrypt.genSalt(10, (err,salt)=>
                 bcrypt.hash(newUser.password, salt, (err,hash)=>{
                     if(err) throw err;
                  
                     newUser.password = hash;
                     console.log('i am here')
                     //save user
 
                     newUser.save()
                     .then(user => {
                         
                         req.flash('success_msg', 'Profile updated')
                         console.log('user updated')
                         res.redirect('/')
                     })
                     .catch(err => console.log(err))
             }))
 
            }
        });
    }   
 })

 

 router.get("/login",  (req,res)=>{
      
    res.render('login');
   
})
 // login handle
 router.post('/login', (req,res,next)=>{
     passport.authenticate('local',{
         successRedirect:'/dashboard',
         failureRedirect: '/users/login',
         failureFlash:true
     })(req,res,next);
     req.flash('success_msg', 'You are logged in')
 });


 //logout hanbdle

 router.get('/logout',(req,res)=>{
     req.logout();
     req.flash('success_msg', 'you are logged out');
     res.redirect('/users/login');
 })


router.get('/delete/:userId', (req, res) => {
    let user_id = req.params.userId
    Users.deleteOne({ _id: req.params.userId }, (error, posts) => {
        if (error) {
            console.warn(error);
        }
        else {
            data = posts
            res.render("delete", {"data": data})
        }
    });
});


  
module.exports=router
