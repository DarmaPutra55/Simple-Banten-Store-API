const express = require('express')
const { cekUser, verifyToken } = require('../logic/auth/auth')
const { putProduct, removeProduct, cekCartBarang, getSingleCart, makeCart } = require('../logic/cart/cart')
const { getSingleProduct } = require('../logic/products/products')
const router = express.Router();

async function userTest(req) {
    const cookie = req.cookies ? req.cookies.auth : null;
    const decode = cookie ? verifyToken(cookie) : null;

    if (!decode) {
        let error = new Error("Login terlebih dahulu.");
        error.status = 500;
        throw error;
    }

    const userId = parseInt(req.params.userId) ? parseInt(req.params.userId) : null;

    if (!(await cekUser(decode.id))) {
        let error = new Error("Pengguna tidak ditemukan.");
        error.status = 500;
        throw error;
    }

    if (userId !== decode.id) {
        let error = new Error("Beda pengguna.");
        error.status = 500;
        throw error;
    }

    return userId;
}

async function itemTest(req){
    const productId = req.body.productId;

    const product = await getSingleProduct(productId);
    
    if(!product){
        let error = new Error("Barang tidak ditemukan.");
        error.status = 500;
        throw error;
    }

    const itemQuantity = req.body.itemQuantity;

    if(itemQuantity > product.stok){
        let error = new Error("Permintaan melibihi stok.");
        error.status = 500;
        throw error;
    }

    return {productId, itemQuantity}
}

router.get('/:userId', async (req, res, next)=>{
    try{
        const userId = await userTest(req, res);
        const cart = await getSingleCart(userId) || await makeCart(userId);
        res.status(200).send(cart);
    }
    catch(err){
        next(err);
    }
})

router.post('/:userId', async (req, res, next) => {
    try {
        const userId = await userTest(req);

        const cart = await getSingleCart(userId) || await makeCart(userId);

        const {productId, itemQuantity} = await itemTest(req);

        if(await cekCartBarang(cart.id, productId)){
            let error = new Error("Barang sudah ada.");
            error.status = 500;
            throw error;
        }

        const cartItem = await putProduct(cart.id, productId, itemQuantity);

        res.status(200).json({
            ok: true
        });
    }

    catch (err) {
        next(err);
    }
})

router.delete('/:userId/:productId', async (req, res, next) => {
    try {
        const userId = await userTest(req);
        const cart = await getSingleCart(userId) || await makeCart(userId);
        const productId = parseInt(req.params.productId) ? parseInt(req.params.productId) : null;

        if(!productId || !(await cekCartBarang(cart.id, productId))){
            let error = new Error("Barang tidak ditemukan.");
            error.status = 500;
            throw error;
        }

        const cartItem = await removeProduct(productId);

        res.status(200).json({
            ok: true
        });
    }

    catch (err) {
        next(err);
    }
})

module.exports = router;