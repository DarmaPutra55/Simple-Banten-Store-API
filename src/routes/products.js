const { Prisma } = require('@prisma/client');
const express = require('express');
const {getAllProduct, getSingleProduct} = require('../logic/products/products')
const router = express.Router();

router.get('/', async (req, res, next)=>{
    try{
        const products = await getAllProduct();
        if(products.length === 0) {
            let error = new Error("Tidak ada barang untuk dijual.");
            error.status = 400;
            throw error;
        }
        res.status(200).send(products);
    }
    catch(error){
        next(error)
    }
})

router.get('/:productId', async(req, res, next)=>{
    try{
        const productId = parseInt(req.params.productId) ? parseInt(req.params.productId) : null;
        const product = await getSingleProduct(productId);
        res.status(200).send(product);
    }
    catch(error){
        let prismaError;
        
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case('P2002'):
                    prismaError = new Error("Product tidak ditemukan!");
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
});

module.exports = router;