const Joi = require('joi');
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true
  },
});


const Menu = mongoose.model('Menu', menuSchema);

function validateUser(menu) {
  const schema = {
    food: Joi.string().min(3).max(50).required(),
    price: Joi.number().required()
  };

  return Joi.validate(menu, schema);
}

exports.Menu = Menu; 
exports.validate = validateUser;