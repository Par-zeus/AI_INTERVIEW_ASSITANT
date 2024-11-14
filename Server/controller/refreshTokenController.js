const jwt = require('jsonwebtoken');
const User = require("../model/user")
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!req.cookies?.jwt) return res.sendStatus(401);
    console.log(cookies);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); 
    
    const foundUser = await User.findOne({ refreshToken:refreshToken });
    //Detected RefreshToken Reuse !!
    if(!foundUser){
        // jwt.verify(
        //     refreshToken,
        //     process.env.REFRESH_TOKEN_SECRET,
        //     async (err, decoded) => {
        //         if(err) return res.sendStatus(403);//Forbidden
        //         console.log("Attempted refresh token reuse !");
        //         const hackedUser = await User.findOne({username:decoded.username}).exec();
        //         hackedUser.refreshToken =[];
        //         const result =await hackedUser.save();
        //         console.log(result);
        //     }
        // )
        return res.sendStatus(403); //Forbidden
    } 

    let newRefreshTokenArray= foundUser.refreshToken.filter(rt => rt !== refreshToken);
      // evaluate jwt
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err){
                console.log('expired refresh token')
                foundUser.refreshToken =[...newRefreshTokenArray];
                const result =await foundUser.save();
                console.log(result);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            
            // Refresh token was still valid
            const roles=Object.values(foundUser.roles);
            const accessToken = jwt.sign(
            {
                "UserInfo":
                {
                    "username":foundUser.username,
                    "roles":roles
                }
            },            
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" } 
          );
    
          const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" } //30d
          );
          // Saving refreshToken with current user
          foundUser.refreshToken =  [...newRefreshTokenArray,newRefreshToken]
          const result = await foundUser.save();
    
          // Creates Secure Cookie with refresh token
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });
    
          res.json({email:foundUser.email,roles, accessToken  });
        }
      );
}



module.exports = { handleRefreshToken };
