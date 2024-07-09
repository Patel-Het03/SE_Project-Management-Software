const jwt = require('jsonwebtoken');

module.exports.authenticate = function(req, res, next){
    try{
        const decode=jwt.verify(req.cookies.usertoken, "abcdef");
        console.log("0000");
        req.userId = decode.id;
        // console.log(req.userId)
        next();
    }catch(e){
        console.log("Unauthorized");
        // console.log("Unauthorized");
        res.status(401).json({message: "Unauthorized"});
    }
}