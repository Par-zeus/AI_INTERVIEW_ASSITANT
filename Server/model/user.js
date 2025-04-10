const mongoose=require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema

const userSchema=new Schema({
  username:{
    type:String,
    // required:true,
    unique:true,
},
    fullName:{
        type:String,
        // required:true,
        // unique:true,
    },
    Gender:{
        type:String,
        // required:true
    },
    profilePic:{
        type:String
    },
    password:{
        type:String,
        // required:true,
    },
    email:{
        type:String,
        // required:true,
        unique:true,
       
    },
    roles: {
        type:Number
    },
    linkedIn:{
      type:String,
      // required:true,
    //   unique:true,
    },
    experience:{
      type:String,
        // required:true,
    },
    phone:{
        type:Number,
    },
    education:{
      type:String,
        // required:true,
        // unique:true,
    },
    resume:{
      type:String,
    },
    skills:{
      type:String
    },
    suggestedRole:{
        type:String
    },
    improvements:[
        String
    ],
    

    refreshToken:[String]      
});

const User = mongoose.model('User', userSchema);

// Ensure indexes are synchronized
User.syncIndexes().then(() => {
    console.log('Indexes are synchronized');
}).catch(err => {
    console.error('Error synchronizing indexes', err);
});

module.exports=User;