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

router.get('/:id', async(req, res, next)=>{
    try{
        const id = parseInt(req.params.id) ? parseInt(req.params.id) : null;
        const product = id ? await getSingleProduct(id) : null;
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