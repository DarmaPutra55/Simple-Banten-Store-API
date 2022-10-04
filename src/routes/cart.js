const { Prisma } = require('@prisma/client');
const express = require('express')
const { AuthManager } = require('../logic/auth/auth')
const { Cart } = require('../logic/cart/cart')
const { Carts } = require('../logic/cart/carts')
const { Product } = require('../logic/product/product')
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.use((req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = AuthManager.cekUserToken(cookie);
        req.jwtValue = jwtValue;
        next();
    }
    catch (error) {
        next(error);
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const fetchedCarts = await Carts.finds();
        if (fetchedCarts.length === 0) throw new Error("Tidak ada cart!");

        res.status(200).send(fetchedCarts);
    }
    catch (error) {
        next(error);
    }
})


router.use(async (req, res, next) => {
    try {
        const fetchedCart = await Cart.find(req.jwtValue.cartId);
        if (!fetchedCart) throw new Error('Cart tidak ditemukan!');
        req.cart = fetchedCart;
        next();
    }
    catch (error) {
        next(error)
    }
})

router.get('/', async (req, res) => {
    res.status(200).send(req.cart);
})

router.post('/',
    body('id_barang').isInt({ min: 0 }),
    body('jumlah').isInt({ min: 0, max: 100 }).isLength({ max: 3 }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const cart = new Cart(req.cart.id, req.cart.id_pengguna);
            const id_barang = req.body.id_barang;
            const jumlah = req.body.jumlah;
            const fetchedProduct = await Product.find(id_barang)
            if (!fetchedProduct) throw new Error("Product tidak ditemukan!");
            if (jumlah > fetchedProduct.stok) throw new Error('Permintaan melebihi stok!');
            const cartItem = await cart.putProduct(id_barang, jumlah);
            res.status(200).json({
                ok: true
            });
        }

        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case ('P2002'):
                        error = new Error("Product sudah ada di cart!");
                        break;

                    default:
                        error = new Error(error.code);
                }
            }
            next(error);
        }
    })

router.patch('/:cartItemId/',
    body('id_cart').isInt({min: 0}).isLength({max: 3}),
    body('id_barang').isInt({min: 0}).isLength({max: 3}),
    body('jumlah').isInt({ min: 0, max: 100 }).isLength({ max: 3 }),
    body('checked').isBoolean(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const cart = new Cart(req.cart.id, req.cart.id_pengguna);
            const cartItemId = parseInt(req.params.cartItemId) ? parseInt(req.params.cartItemId) : null;
            const id_cart = req.body.id_cart;
            const id_barang = req.body.id_barang;
            const jumlah = req.body.jumlah;
            const checked = req.body.checked; 
            const fetchedProduct = await Product.find(id_barang)
            if (!fetchedProduct) throw new Error("Product tidak ditemukan!");
            if (jumlah > fetchedProduct.stok) throw new Error('Permintaan melebihi stok!')
            const cartItem = await cart.updateCartItem(cartItemId, id_cart, id_barang, jumlah, checked);
            res.status(200).json(cartItem);
        }

        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case ('P2002'):
                        error = new Error("Product sudah ada di cart!");
                        break;

                    default:
                        error = new Error(error.code);
                }
            }

            else if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");

            next(error);
        }
    })

router.delete('/:cartItemId', async (req, res, next) => {
    try {
        const cart = new Cart(req.cart.id, req.cart.id_pengguna);
        const cartItemId = parseInt(req.params.cartItemId) ? parseInt(req.params.cartItemId) : null;
        await cart.removeProduct(cartItemId);

        res.status(200).json({
            ok: true
        });
    }

    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case ('P2025'):
                    error = new Error("Product tidak ada di cart!");
                    break;

                default:
                    error = new Error(error.code);
            }
        }

        else if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
})

router.delete('/clear', async (req, res, next) => {
    try {
        const cart = new Cart(req.cart.id, req.cart.id_pengguna);

        await cart.clearCart();

        res.status(200).json({
            ok: true
        });
    }

    catch (error) {
        next(error);
    }
})

module.exports = router;