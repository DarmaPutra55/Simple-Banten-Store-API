const express = require('express')
const {makeToken, getUser} = require('../logic/auth/auth')
const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        const user = await getUser(email, username, password);
        if(!user) throw new Error();
        const token = makeToken(user.id, user.username);
        res.cookie('auth', token);
        res.status(200).json({
            ok: true
        })
    }
    catch(err){
        return res.status(404).json({ 
            ok: false,
            error: "Gagal login" 
        })
    }
})

module.exports = router;