const { Prisma, prisma } = require('@prisma/client');
const { Category } = require('../logic/category/category');
const { Categories } = require('../logic/category/categories');
const express = require('express');
const { Product } = require('../logic/product/product');
const { Products } = require('../logic/product/products');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const categories = await Categories.finds();
        if (categories.length === 0) throw new Error("Tidak ada categori barang!");
        res.status(200).send(categories);
    }
    catch (error) {
        next(error);
    }
})

router.get('/:categoryName', async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        const fetchedProducts = await Products.findsBasedOnCategoryName(categoryName);
        if (fetchedProducts.length === 0) throw new Error("Tidak ada barang dengan kategory tersebut!");
        const products = fetchedProducts.map((fetchedProduct)=>{
            const product = new Product(fetchedProduct.id, fetchedProduct.nama, fetchedProduct.deskripsi, fetchedProduct.tabel_kategori.kategori, fetchedProduct.harga, fetchedProduct.stok, fetchedProduct.terjual, fetchedProduct.diskon, fetchedProduct.gambar, {"rate": parseFloat(fetchedProduct.rate), "jumlah_rating": fetchedProduct.jumlah_rating});
            return product;
        })
        res.status(200).send(products);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
})

module.exports = router;