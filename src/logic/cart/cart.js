const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function putProduct(cartId, productId, itemQuantitiy) {
    const cartItem = prisma.table_cart_barang.create({
        data: {
            id_cart: cartId,
            id_barang: productId,
            jumlah: itemQuantitiy
        }
    })
                
    return cartItem;

}

async function removeProduct(productId) {
    const cartItem = await prisma.table_cart_barang.deleteMany({
        where: {
            id_barang: productId
        }
    })

    return cartItem;
}

async function getSingleCart(userId) {
    const cart = await prisma.tabel_cart.findFirst({
        where: {
            id_pengguna: userId
        },
        include: {
            table_cart_barang: {
                select: {
                    id: true,
                    id_barang: true,
                    jumlah: true
                }
            },
        }
    })

    return cart;
}

async function makeCart(userId) {
    const cart =  await prisma.tabel_cart.create({
        data: {
            id_pengguna: userId
        },
        include: {
            table_cart_barang: {
                select: {
                    id: true,
                    id_barang: true,
                    jumlah: true
                }
            },
        }
    })

    return cart;
}

async function cekCartBarang(cartId, productId){
    const cartItem = await prisma.table_cart_barang.findFirst({
        where: {
            AND: [
                { id_cart: cartId },
                { id_barang: productId }
            ]
        }
    })

    return cartItem ? true : false;
}

async function getAllCart() {

}

async function clearCart() {

}

module.exports = { putProduct, removeProduct, makeCart, cekCartBarang, getSingleCart, getAllCart, clearCart }