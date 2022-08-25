const express = require('express')
const {makeToken, getUser, register} = require('../logic/auth/auth')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        const user = await getUser(email, username, password);
        if(user) {
            let error = new Error("Pengguna sudah ada.");
            error.status = 500;
            throw error;
        }

        const newUser = await register(email, username, password);
        if(!newUser) {
            let error = new Error("Terjadi kesalahan.");
            error.status = 500;
            throw error;
        }
        
        const token = makeToken(newUser.id, newUser.username);
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