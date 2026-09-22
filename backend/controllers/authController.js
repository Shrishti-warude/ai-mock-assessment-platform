const User = require("../models/User");
const bcrypt = require('bcryptjs');

const registerUser = async(req , res)=>{
    try{
        const {name , email , password} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'Email is already registered'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password , salt);

        const user = await User.create({
            name,
            email,
            password:hashedPass,
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                name : user.name,
                email : user.email,
                message : 'User is successfully registered',
            });
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {registerUser};