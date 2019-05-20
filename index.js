const express = require('express');
const app = express();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const {User, validate} = require('./models/user');
const bodyParser=require('body-parser');

mongoose.connect('mongodb://localhost/Logging')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api/get',async(req,res)=>{
    res.json('RUNNING');
});

app.post('/api/register', async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.json({status:'0', message: error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.json({status:'0',message:'User already registered.'});

    user = new User(_.pick(req.body, ['name', 'email', 'password','phone']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.json({status:'1',message:'Registeration Success'});
});

app.post('/api/login', async (req,res) =>{
    const {error} = val(req.body);
    if (error) return res.json({status:'0', message: error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({status:'0',message:'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.json({status:0,message:'Invalid email or password.'})

    res.json({status:'1', message:'Login Success', name:user.name,email:user.email, phone:user.phone });
});

function val(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));