const { Prisma } = require('@prisma/client');
const express = require('express')
const { makeCart } = require('../logic/cart/cart')
const { makeToken, register } = require('../logic/auth/auth')
const router = express.Router();

router.post('/', async (req, res, next)=>{
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        const user = await register(email, username, password);
        const cart = await makeCart(user.id);
        const token = makeToken(user.id, user.username);
        res.cookie('auth', token);
        res.status(200).json({
            ok: true
        });
    }
    catch(error){
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2002'):
                    prismaError = new Error("Username atau Email sudah terdaftar!");
                    prismaError.status = 400;
                    break;
                
                default:
                    prismaError = new Error(error.code);
                    prismaError.status = 400;
            }
        }

        next(prismaError || error);
    }
})

module.exports = router;