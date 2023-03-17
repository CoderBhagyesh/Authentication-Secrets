//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(console.log("mongoose connected on port 27017"));

userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

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

app.post('/register', function(req,res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save().then(res.render('secrets'));
});

app.post('/login', async function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

    const doc = await User.findOne({email: username}).exec();
    if(doc.email === username && doc.password===password) {
      console.log(doc.password);
      res.render('secrets');
    }
    else {
      res.send("Incorrect username or password");
    }
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
})