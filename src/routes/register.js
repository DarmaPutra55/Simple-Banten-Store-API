const { Prisma } = require('@prisma/client');
const express = require('express');
const { Cart } = require('../logic/cart/cart');
const { User } = require('../logic/user/user')
const { AuthManager } = require('../logic/auth/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/',
    body('username').isLength({ max: 35 }).not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;

            const auth = new AuthManager(username, password, email);
            if (await User.findUser(auth.username, auth.password)) throw new Error('User sudah teregistrasi!');
            const user = await auth.register();
            const cart = await Cart.create(user.id);
            const token = auth.login(user.id, user.id_role, cart.id);
            res.cookie('auth', token);
            res.status(200).json({
                ok: true
            });
        }
        catch (error) {
            let prismaError;

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case ('P2002'):
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