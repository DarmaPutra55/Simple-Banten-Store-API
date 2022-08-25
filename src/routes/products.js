const express = require('express');
const {getAllProduct, getSingleProduct} = require('../logic/products/products')
const router = express.Router();

router.get('/', async (req, res)=>{
    try{
    const products = await getAllProduct();
    if(!products) throw new Error();
    res.status(200).send(products);
    }
    catch(err){
        return res.status(404).json({ 
            ok: false,
            error: "Barang tidak ditemukan" 
        })
    }
})

router.get('/:id', async(req, res)=>{
    try{
        const product = await getSingleProduct(parseInt(req.params.id));
        if(!product) throw new Error();
        res.status(200).send(product);
    }
    catch(err){
        return res.status(404).json({ 
            ok: false,
            error: "Barang tidak ditemukan" 
        })
    }
});

module.exports = router;