const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const {User, validate} = require('./models/user');

mongoose.connect('mongodb://localhost/Logging')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.post('/api/login', async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send(user);
});

// app.post('/api/login', async (req,res) =>{
//     const {error} = val(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     let user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status(400).send('Invalid email or password.');

//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) return res.status(400).send('Invalid email or password.');

//     res.send('Login Success');
// });

// function val(req) {
//     const schema = {
//       email: Joi.string().min(5).max(255).required().email(),
//       password: Joi.string().min(5).max(255).required()
//     };
  
//     return Joi.validate(req, schema);
//   }

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));