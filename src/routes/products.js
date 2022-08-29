const express = require('express');
const {getAllProduct, getSingleProduct} = require('../logic/products/products')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const products = await getAllProduct();
        if(!products) {
            let error = new Error("Barang tidak ditemukan.");
            error.status = 400;
            throw error;
        }
        res.status(200).send(products);
    }
    catch(error){
        next(error)
    }
})

router.get('/:itemId', async(req, res, next)=>{
    try{
        const itemId = parseInt(req.params.itemId) ? parseInt(req.params.itemId) : null;
        const product = itemId ? await getSingleProduct(itemId) : null;
        if(!product) {
            let error = new Error("Barang tidak ditemukan.");
            error.status = 400;
            throw error;
        }
        res.status(200).send(product);
    }
    catch(error){
        next(error)
    }
});

module.exports = router;