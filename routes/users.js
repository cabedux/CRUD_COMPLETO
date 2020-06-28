var express = require('express');
var router = express.Router();
let connection = require('../config/db.js')
/* GET users listing. */
router.get('/', function(req, res) {
  let queryusers = `Select * from user, phone 
                  where phone.phone_id = user.phone_id`;

  connection.query(queryusers, function(err, datalist) {
    if (err) throw err;
    res.render('users',{datalist});
  })
});

//formulario de nuevo cliente
router.get('/newuser', function(req, res) {

    res.render('userform');

});

//añadir nuevo cliente
router.post('/adduser', function(req, res) {
  let user = req.body;
  let queryPhone = `insert into phone (model, color) 
                  values ('${user.model}', '${user.color}')`;
  
  connection.query(queryPhone, function(err, phoneData) {
    if (err) throw err;
    let phone_id = phoneData.insertId;

    let queryUser = `insert into user(name, last_name, phone_id)
              values ('${user.name}', '${user.last_name}', ${phone_id})`;
    connection.query(queryUser, function(err, userData){
      if (err) throw err;
      res.redirect('/users');
    });
  });

});

router.get('/delete/:iduser', function(req,res){
  let userId = req.params.iduser;
  let queryPhone = `select phone_id from user where user_id = ${userId}`;
  connection.query(queryPhone, function(err, dataPhone){
    if (err) throw err; 
    console.log(dataPhone);  
    let queryDelete = `delete from phone where phone_id = ${dataPhone[0].phone_id}`;
    
    connection.query(queryDelete, function(err, data){
      if (err) throw err;
      res.redirect('/users');
    });
  });

});

router.get('/profile/:iduser', function(req, res){
  let userId = req.params.iduser;
  
  let queryUser = `select * from user, phone 
  where user.phone_id = phone.phone_id and user.user_id = ${userId}`;
  
  connection.query(queryUser, function(err, userData){
    if (err) throw err;
    res.render('userprofile', {userData : userData[0]});
  });
});

router.get('/edituser/:iduser', function(req, res){
  let userId = req.params.iduser;
  
  let queryUser = `select * from user, phone 
  where user.phone_id = phone.phone_id and user.user_id = ${userId}`;
  
  connection.query(queryUser, function(err, userData){
    if (err) throw err;
    res.render('editform', {userData : userData[0]});
  });
});

router.post('/update/:iduser', function(req, res){
  let userId = req.params.iduser;
  let user = req.body;
  
  let queryPhone = `update phone 
  set model = '${user.model}', color = '${user.color}' 
  where phone_id  = (select phone_id from user where user_id = ${userId})`;  
  
  connection.query(queryPhone, function(err, phoneData){
    if (err) throw err;
    let queryUser = `update user 
    set name = '${user.name}', last_name = '${user.last_name}'
    where user_id = ${userId}`;
    connection.query(queryUser, function(err, userData){
      if (err) throw err;
      res.redirect(`/users/profile/${userId}`);
    });
  });
});


module.exports = router;