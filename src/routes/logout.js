const express = require('express')
const {verifyToken} = require('../logic/auth/auth')
const router = express.Router();

router.post('/', (req, res, next)=>{
    try{
        res.clearCookie("auth");
        res.status(200).json({
            ok: true
        });
    }
    catch(err){
        next(err);
    }
})

module.exports = router;