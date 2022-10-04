const { Prisma } = require('@prisma/client');
const express = require('express');
const { Product } = require('../logic/product/product')
const { Products } = require('../logic/product/products')
const { Discussions } = require('../logic/discussion/discussions')
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let searchParams = {};
        let paginationParams = {};
        if (req.query.nama) searchParams.nama = {
            contains: req.query.nama,
        };

        if (req.query.kategori) searchParams.tabel_kategori = {
            kategori: req.query.kategori,
        };

        if (parseInt(req.query.skip)) paginationParams.skip = parseInt(req.query.skip);
        if (parseInt(req.query.limit)) paginationParams.take = parseInt(req.query.limit);

        const fetchedProducts = await Products.finds(searchParams, paginationParams);
        if (fetchedProducts.length === 0) throw new Error("Tidak ada barang untuk dijual.");
        const products = await Promise.all(fetchedProducts.map(async (fetchedProduct) => {
            const ulasan = await Discussions.countDiscussionBasedOnProductId(fetchedProduct.id);
            const product = new Product(fetchedProduct.id, fetchedProduct.nama, fetchedProduct.deskripsi, fetchedProduct.tabel_kategori.kategori, fetchedProduct.harga, fetchedProduct.stok, fetchedProduct.terjual, fetchedProduct.diskon, fetchedProduct.gambar, { "rate": parseFloat(fetchedProduct.rate), "jumlah_rating": fetchedProduct.jumlah_rating }, ulasan);
            return product;
        }))
        res.status(200).send(products);
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
        const ulasan = await Discussions.countDiscussionBasedOnProductId(fetchedProduct.id);
        const product = new Product(fetchedProduct.id, fetchedProduct.nama, fetchedProduct.deskripsi, fetchedProduct.tabel_kategori.kategori, fetchedProduct.harga, fetchedProduct.stok, fetchedProduct.terjual, fetchedProduct.diskon, fetchedProduct.gambar, { "rate": parseFloat(fetchedProduct.rate), "jumlah_rating": fetchedProduct.jumlah_rating }, ulasan)
        res.status(200).send(product);
    }

    catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) error = new Error("Tipe untuk parameter salah!");
        next(error);
    }
});

module.exports = router;