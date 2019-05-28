const express=require('express');
const router=express.Router();
const {Menu, validate} = require('../models/menu');
const _ =require('lodash');

router.get('/', async (req,res)=>{
    const menu=await Menu.find();
    if(menu) return res.json({status:'1', message:'success' ,allItems:menu });
});

router.post('/', async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.json({status:'0', message: error.details[0].message});

    let menu = await Menu.findOne({ food: req.body.food });
    if (menu) return res.json({status:'0',message:'Item already exists.'});

    menu = new Menu(_.pick(req.body, ['food','price']));
    await menu.save();

    res.json({status:'1',message:'Added Successfully'});
});

module.exports=router;
