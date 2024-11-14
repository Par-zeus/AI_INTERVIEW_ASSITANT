
const User = require("../model/user")
require('dotenv').config();

const handleLogout = async (req, res) => {
    //On Client also delete the refreshToken

    const cookies = req.cookies;
    if (!req.cookies?.jwt) return res.sendStatus(204) ; //No Content
    const refreshToken = cookies.jwt;

    // Is refresh Token in db?
    const foundUser = await User.findOne({ refreshToken });
    if(!foundUser){
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true}); 
        return res.sendStatus(403);
    }

    //Delete refreshToken in Db
     
    foundUser.refreshToken = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
      );
      const result = await foundUser.save();
      console.log(result);
    
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      res.sendStatus(204);
    };

module.exports ={handleLogout}
