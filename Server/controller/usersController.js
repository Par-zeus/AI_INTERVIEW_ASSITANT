const User=require("../model/user")
const mongoose=require('mongoose')
// const Product=require('../model/productSchema')

const getUser = async (req, res) => {
    try {
        const {email} =req.params;
        const user = await User.findOne({email:email});
        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getAllUser=async(req,res)=>{
    try {
        const user=await User.find();
        res.json(user)
    } catch (error) {
        res.send("Error while fetching users")
    }
}
const delUser=async(req,res)=>{
    try {
        console.log(req.body.email);
        const user=await User.findOne({email:email});
        await user.deleteOne()
        res.send("User deleted successfully")
    } catch (error) {
        res.status(500).send(error)
    }
}
const updateUser=async(req,res)=>{
    try {
        const {email}=req.params;
        // const user=await User.findByIdAndUpdate(req.user._id,req.body,{ new: true })
        const user=await User.findOneAndUpdate({email:email},req.body.formData,{new:true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json("Upadation not done")
    }
}

// const User = require('../models/User'); // Adjust the path to your User model
// const Product = require('../models/Product'); // Adjust the path to your Product model

module.exports={
    getAllUser,delUser,updateUser,getUser
}