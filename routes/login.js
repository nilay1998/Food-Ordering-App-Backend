const express=require('express');
const router=express.Router();
const {User, validate,val} = require('../models/user');
const bcrypt=require('bcrypt');


router.post('/', async (req,res) =>{
    const {error} = val(req.body);
    if (error) return res.json({status:'0', message: error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({status:'0',message:'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.json({status:0,message:'Invalid email or password.'})

    res.json({status:'1', message:'Login Success', name:user.name, email:user.email, phone:user.phone, isAdmin:user.isAdmin });
});

module.exports=router;
