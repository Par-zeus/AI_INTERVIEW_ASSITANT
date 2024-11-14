const User =require('../model/user');
const bcrypt =require('bcryptjs');

const handleNewUser =async(req,res)=>{
    try {
        console.log(req.body);
        const user=new User({
            username:req.body.username,
            password:req.body.password,
            email:req.body.email
        });
        user.password=await bcrypt.hash(user.password,10)
        const savedUserData=await user.save();
        console.log(savedUserData);
        res.status(201).json({'success':`New user ${savedUserData.username} created! `});   
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
}

module.exports ={handleNewUser};