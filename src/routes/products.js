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
        res.status(404).send("Items not found");
    }
})

router.get('/:id', async(req, res)=>{
    try{
        const product = await getSingleProduct(parseInt(req.params.id));
        if(!product) throw new Error();
        res.status(200).send(product);
    }
    catch(err){
        res.status(404).send("Item not found");
    }
});

module.exports = router;