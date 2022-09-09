const { Prisma } = require('@prisma/client');
const express = require('express')
const { AuthManager } = require('../logic/auth/auth')
const { Cart } = require('../logic/cart/cart')
const { Carts } = require('../logic/cart/carts')
const { Product } = require('../logic/product/product')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = AuthManager.cekUserToken(cookie);
        const fetchedCarts = await Carts.finds();
        if(fetchedCarts.length === 0) throw new Error("Tidak ada cart!");

        res.status(200).send(fetchedCarts);
    }
    catch(error){
        next(error);
    }
})

router.get('/:cartId', async (req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = AuthManager.cekUserToken(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;
        const fetchedCart = await Cart.find(cartId);
        if (!fetchedCart) throw  new Error('Cart tidak ditemukan!');
        if (jwtValue.id !== fetchedCart.id_pengguna) throw new Error('Pengguna bukan pemilik cart!');
        res.status(200).send(fetchedCart);
    }
    catch(error){
        if(error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
})

router.post('/:cartId', async (req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = AuthManager.cekUserToken(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;
        const fetchedCart = await Cart.find(cartId);
        if(!fetchedCart) throw new Error('Cart tidak ditemukan!');
        if(jwtValue.id !== fetchedCart.id_pengguna) throw new Error('Pengguna bukan pemilik cart!');

        const cart = new Cart(fetchedCart.id, fetchedCart.id_pengguna);
        const productId = req.body.productId;
        const productQuantity = req.body.productQuantity;
        const fetchedProduct = await Product.find(productId)
        if(!fetchedProduct) throw new Error("Product tidak ditemukan!");
        if(productQuantity > fetchedProduct.stok) throw new Error('Permintaan melebihi stok!')
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
        const jwtValue = AuthManager.cekUserToken(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        const fetchedCart = await Cart.find(cartId);
        if(!fetchedCart) throw new Error('Cart tidak ditemukan!');
        if(jwtValue.id !== fetchedCart.id_pengguna) throw new Error('Pengguna bukan pemilik cart!');
        
        const cart = new Cart(fetchedCart.id, fetchedCart.id_pengguna);

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

router.delete('/:cartId/clear', async(req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = AuthManager.cekUserToken(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        const fetchedCart = await Cart.find(cartId)
        
        if(!fetchedCart) throw new Error('Cart tidak ditemukan!');
        if(jwtValue.id !== fetchedCart.id_pengguna) throw new Error('Pengguna bukan pemilik cart!');

        const cart = new Cart(fetchedCart.id, fetchedCart.id_pengguna);

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