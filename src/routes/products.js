const { Prisma } = require('@prisma/client');
const express = require('express');
const { Product } = require('../logic/product/product')
const { Products } = require('../logic/product/products')
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const products = new Products(await Products.init());
        if (products.gets().length === 0) throw new Error("Tidak ada barang untuk dijual.");
        res.status(200).send(products.gets());
    }
    catch (error) {
        next(error)
    }
})

router.get('/:productId', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId) ? parseInt(req.params.productId) : null;
        const product = new Product(await Product.init(productId));

        if (!product.get()) throw new Error("Barang tidak ditemukan!");
        res.status(200).send(product.get());
    }

    catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
});

module.exports = router;