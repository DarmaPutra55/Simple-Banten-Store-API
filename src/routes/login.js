const express = require('express')
const { Cart } = require('../logic/cart/cart')
const { AuthManager } = require('../logic/auth/auth')
const router = express.Router();

router.post('/', async (req, res, next)=>{
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        if(req.cookies.auth) throw new Error("User sudah login!");
        const auth = new AuthManager(email, username, password);
        const user = await auth.findUser();
        if(!user) throw new Error("User tidak ditemukan!");
        const cart = await Cart.DoUserHasCart(user.id);
        if(!cart) await Cart.create(user.id);
        const token = auth.login(user.id);
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