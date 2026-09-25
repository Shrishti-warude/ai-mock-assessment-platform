const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const generateAccessToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET || 'mySecret123' , {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({id} , process.env.REFRESH_TOKEN_SECRET || 'otherSecret123' , {
        expiresIn:'7d',
    });
};




const registerUser = async(req , res)=>{
    try{
        const {name , email , password} = req.body;


        if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required!' });
    }

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
            
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('refreshToken' , refreshToken , {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite : 'strict',
                maxAge:7*24*60*60*1000,
            });


            res.status(201).json({
                _id: user._id,
                name : user.name,
                email : user.email,
                accessToken,
                message : 'User is successfully registered',
            });
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};



const loginUser = async (req , res) => {
    try{
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:'Email and password is required'});
        }

        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password , user.password))){
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('refreshToken' , refreshToken, {
                httpOnly : true,
                secure: process.env.NODE_ENV === 'production',
                sameSite : 'strict',
                maxAge : 7*24*60*60*1000
            });

            res.status(200).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                accessToken,
                message:"Login successfully!",
            });
        }

        else{
            res.status(401).json({message : 'Invalid email or password'});
        }
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
};

const refreshAccessToken =  async(req , res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message : 'Refresh token not found!'})
        }

        jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET || 'otherSecret123' , (err , decoded) => {
            if(err){
                return res.status(403).json({message: 'Invalid or expired refresh token!'});
            }

            const newAccessToken = generateAccessToken(decoded.id);
            res.json({accessToken : newAccessToken});
        });
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
};

module.exports = {registerUser , loginUser , refreshAccessToken};