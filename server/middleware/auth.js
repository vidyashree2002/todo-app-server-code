const jwt = require("jsonwebtoken");
const SECRET = "vidyatods";

// authentication basically a middleware (middleware takes 3 parameters , res , req , next())

const authentication = (req, res , next)=>{    // parameter of a function
    const authheader = req.header.authorization;

    if(authheader){
        const token = authheader.split(' ')[1];    // THE FORMAT of the token
        jwt.verify(token , SECRET , (err, user)=>{
            if(err){
                return res.status(404);
            }
            req.user = user;
            next();
        })
    }

};

module.exports = {
    authentication,
    SECRET
}