const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Name is compulsory'],
    },
    email : {
        type : String,
        required : [true , 'Email is mandatory'],
        unique : true,
    },
    password: {
      type: String,
      required: [true, 'Password required hai'],
    }
  },
  {
    timestamps: true, // Automatically createdAt aur updatedAt fields add karega
  }
);

module.exports = mongoose.model('User' , userSchema);