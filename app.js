
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(console.log("mongoose connected on port 27017"));

userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', function(req,res) {
  res.render('home');
});

app.get('/register', function(req,res) {
  res.render('register');
});

app.get('/login', function(req,res) {
  res.render('login');
});

app.get('/logout', function(req, res) {
  res.render('home');
})

app.post('/register', function(req,res) {
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save().then(res.render('secrets'));
  });

});

app.post('/login', async function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

    const doc = await User.findOne({email: username}).exec();
    bcrypt.compare(password, doc.password, function(err, result) {
      if(result===true) {
        res.render('secrets');
      } else {
        res.send("Your password is incorrect");
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
