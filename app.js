const express = require('express')
const mongoose = require('mongoose')
const app = express();
const passport = require('passport'); 
expressLayouts = require('express-ejs-layouts');
const session =require("express-session");
flash = require("connect-flash"); 
const nodemailer = require('nodemailer')

// DB config
db = require('./config/keys').MongURI;
require('./config/passport')(passport);

app.set('view engine', 'ejs')
app.use(expressLayouts);

app.use(express.static('public'))

app.use(express.urlencoded({extended:true}));

//Connection to the mongoDB dtatbase
mongoose.connect('mongodb://localhost:27017/upbaseDB', {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log('Mongo DB connected...'))
.catch(err => console.log(err));


//flash
app.use(flash());
//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

  }))
  




 //passport middleware
 app.use(passport.initialize());
 app.use(passport.session())

 // seting gloabal variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('succ    ess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

//Routes
 app.use('/', require('./routes/index'));
 app.use('/users', require('./routes/users'));



 



let port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("server starteed at "+ port)
})