const { Prisma } = require('@prisma/client');
const express = require('express')
const { cekLogin } = require('../logic/auth/auth')
const { putProduct, removeProduct, cekUserCart, getSingleCart, deleteCart, clearCart, getAllCart } = require('../logic/cart/cart')
const { cekProduct } = require('../logic/products/products')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const carts = await getAllCart(cartId);

        if(carts.length === 0){
            let error = new Error("Tidak ada cart!");
            error.status = 400;
            throw error;
        }

        res.status(200).send(carts);
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

        if(!(await cekUserCart(cartId, jwtValue.id))){
            let error = new Error("Terjadi kesalahan saat mengambil cart!");
            error.status = 400;
            throw error;
        }

        res.status(200).send(cart);
    }
    catch(error){
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientValidationError){
            prismaError = new Error("Tipe untuk parameter salah!");
            prismaError.status = 400;
        }

        next(prismaError || error);
    }
})

router.post('/:cartId', async (req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        if(!(await cekUserCart(cartId, jwtValue.id))){
            let error = new Error("Terjadi kesalahan saat mengambil cart!");
            error.status = 400;
            throw error;
        }

        const cart = await getSingleCart(cartId);
        const productId = req.body.productId;
        const productQuantity = req.body.productQuantity;
        await cekProduct(productId, productQuantity);
        const cartItem = await putProduct(cart.id, productId, productQuantity);

        res.status(200).json({
            ok: true
        });
    }

    catch (error) {
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2002'):
                    prismaError = new Error("Product sudah ada di cart!");
                    prismaError.status = 400;
                    break;
                
                default:
                    prismaError = new Error(error.code);
                    prismaError.status = 400;
            }
        }

        else if(error instanceof Prisma.PrismaClientValidationError){
            prismaError = new Error("Tipe untuk parameter salah!");
            prismaError.status = 400;
        }

        next(prismaError || error);
    }
})

router.delete('/:cartId/:cartItemId', async (req, res, next) => {
    try {
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        if(!(await cekUserCart(cartId, jwtValue.id))){
            let error = new Error("Terjadi kesalahan saat mengambil cart!");
            error.status = 400;
            throw error;
        }

        const cartItemId = parseInt(req.params.cartItemId) ? parseInt(req.params.cartItemId) : null;
        const cartItem = await removeProduct(cartItemId);

        res.status(200).json({
            ok: true
        });
    }

    catch (error) {
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2025'):
                    prismaError = new Error("Product tidak ada di cart!");
                    prismaError.status = 400;
                    break;
                
                default:
                    prismaError = new Error(error.code);
                    prismaError.status = 400;
            }
        }

        else if(error instanceof Prisma.PrismaClientValidationError){
            prismaError = new Error("Tipe untuk parameter salah!");
            prismaError.status = 400;
        }

        next(prismaError || error);
    }
})

router.post('/:cartId/clear', async(req, res, next)=>{
    try{
        const cookie = req.cookies ? req.cookies.auth : null;
        const jwtValue = await cekLogin(cookie);
        const cartId = parseInt(req.params.cartId) ? parseInt(req.params.cartId) : null;

        if(!(await cekUserCart(cartId, jwtValue.id))){
            let error = new Error("Terjadi kesalahan saat mengambil cart!");
            error.status = 400;
            throw error;
        }

        const cartItem = await clearCart(cartId);
        res.status(200).json({
            ok: true
        });
    }

    catch(error){
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientValidationError){
            prismaError = new Error("Tipe untuk parameter salah!");
            prismaError.status = 400;
        }

        next(prismaError || error);
    }
})

module.exports = router;