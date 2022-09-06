const { Prisma } = require('@prisma/client');
const express = require('express');
const { Product } = require('../logic/product/product')
const { Products } = require('../logic/product/products')
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const fetchedProducts = await Products.finds();
        if (fetchedProducts.length === 0) throw new Error("Tidak ada barang untuk dijual.");
        res.status(200).send(fetchedProducts);
    }
    catch (error) {
        next(error)
    }
})

router.get('/:productId', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId) ? parseInt(req.params.productId) : null;
        const fetchedProduct = await Product.find(productId);
        if (!fetchedProduct) throw new Error("Barang tidak ditemukan!");
        res.status(200).send(fetchedProduct);
    }

    catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
});

module.exports = router;