const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const login=require('./routes/login');
const register=require('./routes/register');
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/Logging')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/login',login);
app.use('/api/register',register);

app.get('/api/get',async(req,res)=>{
    res.json('RUNNING');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));