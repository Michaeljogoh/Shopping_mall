const express = require('express');
const app = express();
const router = express.Router();

const {ensureAuthenticated} = require('../config/auth');
const fs =require('fs')


router.get("/", (req, res)=>{
  fs.readFile('items.json', function(error, data){
      if(error){
          res.status(500).end()
      } else {
          res.render('store',{
              items: JSON.parse(data)

          });
      }

  })
});

router.get('/dashboard',  ensureAuthenticated, (req, res)=> 
    res.render('dashboard',{
        name: req.user.name
    

}));
    
        
 
module.exports=router;