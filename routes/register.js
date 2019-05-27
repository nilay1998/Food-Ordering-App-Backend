const express=require('express');
const router=express.Router();
const _ =require('lodash');
const {User, validate} = require('../models/user');
const bcrypt=require('bcrypt');

router.post('/', async (req,res) => {
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

module.exports=router;