const express = require('express')
const {makeToken, getUser, verifyToken} = require('../logic/auth/auth')
const router = express.Router();

router.post('/', async (req, res, next)=>{
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        const user = await getUser(email, username, password);
        if(!user) {
            let error = new Error("Pengguna tidak ditemukan.");
            error.status = 400;
            throw error;
        }
        const token = makeToken(user.id, user.username);
        res.cookie('auth', token);
        res.status(200).json({
            ok: true
        });
    }
    catch(error){
        next(error);
    }
})

module.exports = router;