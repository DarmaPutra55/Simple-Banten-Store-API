const express = require('express')
const { Cart } = require('../logic/cart/cart')
const { AuthManager } = require('../logic/auth/auth')
const { User } = require('../logic/user/user')
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/',
    body('username').isLength({ max: 35 }).not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const username = req.body.username;
            const password = req.body.password;
            if (req.cookies.auth) throw new Error("User sudah login!");
            const auth = new AuthManager(username, password);
            const user = await User.findUser(auth.username, auth.password);
            if (!user) throw new Error("User tidak ditemukan!");
            const cart = await Cart.findCartBasedOnUserId(user.id);
            if (!cart) await Cart.create(user.id);
            const token = auth.login(user.id, user.id_role, cart.id);
            res.cookie('auth', token);
            res.status(200).json({
                ok: true
            });
        }
        catch (error) {
            next(error);
        }
    })

router.get('/', (req, res, next) => {
    try {
        const token = req.cookies ? req.cookies.auth : null;
        const decodeToken = AuthManager.cekUserToken(token);
        res.status(200).json(decodeToken);
    }
    catch (err) {
        res.status(400).json({
            ok: false
        })
    }
})

module.exports = router;