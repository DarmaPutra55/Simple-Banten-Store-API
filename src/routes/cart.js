const { Prisma } = require('@prisma/client');
const express = require('express')
const { cekLogin } = require('../logic/auth/auth')
const { Cart } = require('../logic/cart/cart')
const { Carts } = require('../logic/cart/carts')
const { Product } = require('../logic/product/product')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const carts = new Carts(await Carts.init());

        if(carts.length === 0){
            let error = new Error("Tidak ada cart!");
            error.status = 400;
            throw error;
        }

        res.status(200).send(carts.gets());
    }
    catch(error){
        next(error);
    }
})

router.get('/:cartId', async (req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;
        const cart = new Cart(await Cart.init(cartId));
        if (!cart.get()) throw  new Error('Cart tidak ditemukan!');
        if (jwtValue.id !== cart.get().id_pengguna) throw new Error('Pengguna bukan pemilik cart!');

        res.status(200).send(cart.get());
    }
    catch(error){
        if(error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
})

router.post('/:cartId', async (req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;
        const cart = new Cart(await Cart.init(cartId));
        if(!cart.get()) throw new Error('Cart tidak ditemukan!');
        if (jwtValue.id !== cart.get().id_pengguna) throw new Error('Pengguna bukan pemilik cart!');

        const productId = req.body.productId;
        const productQuantity = req.body.productQuantity;
        const product = new Product(await Product.init(productId));
        if(productQuantity > product.get().stok) throw new Error('Permintaan melebihi stok!')
        const cartItem = await cart.putProduct(productId, productQuantity);
        res.status(200).json({
            ok: true
        });
    }

    catch (error) {        
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2002'):
                    error = new Error("Product sudah ada di cart!");
                    break;
                
                default:
                    error = new Error(error.code);
            }
        }

        else if(error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");

        next(error);
    }
})

router.delete('/:cartId/:cartItemId', async (req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        const cart = new Cart(await Cart.init(cartId));
        const cartItemId = parseInt(req.params.cartItemId) ? parseInt(req.params.cartItemId) : null;
        await cart.removeProduct(cartItemId);

        res.status(200).json({
            ok: true
        });
    }

    catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2025'):
                    error = new Error("Product tidak ada di cart!");
                    break;
                
                default:
                    error = new Error(error.code);
            }
        }

        else if(error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
})

router.post('/:cartId/clear', async(req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        const cart = new Cart(await Cart.init(cartId));
        await cart.clearCart();

        res.status(200).json({
            ok: true
        });
    }

    catch(error){
        if(error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");

        next(error);
    }
})

module.exports = router;