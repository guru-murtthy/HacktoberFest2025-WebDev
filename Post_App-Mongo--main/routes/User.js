const express=require("express");
const {checkValidation,registerValidator}=require("../configs/customValidator");
const { SignUp } = require("../controllers/users");

const router=express.Router();
router.post("/signup",registerValidator,checkValidation,SignUp)

module.exports=router;