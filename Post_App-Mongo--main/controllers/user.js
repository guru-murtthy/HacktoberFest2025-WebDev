const User=require("../models/user");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")

exports.SignUp=async(req,res)=>{
    try{
        const {name,username,email,password}=req.body;

        const isUser=User.findOne({email});
        if(isUser){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }

        const hashedPass=await bcrypt.hash(password,10);
        const newuser=await User.create({name,username,email,password:hashedPass});
        return res.status(200).json({
            success:true,
            message:"User created SuccessFullly"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:err.message
        })
    }
}