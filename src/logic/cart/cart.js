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

async function removeProduct(cartItemId) {
    const cartItem = await prisma.table_cart_barang.delete({
        where: {
            id: cartItemId
        }
    })

    return cartItem;
}

async function getSingleCart(cartId) {
    const cart = await prisma.tabel_cart.findUnique({
        where: {
            id: cartId
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

async function cekUserCart(cartId, userId){
    const cart = await prisma.tabel_cart.findFirst({
        where: {
            AND: [
                    {id: cartId},
                    {id_pengguna: userId}
                ]
            
        }
    })

    return cart;
}

async function getAllCart() {
    const carts = await prisma.tabel_cart.findMany();
    return carts;
}

async function clearCart(cartId) {
    const cartItem = await prisma.table_cart_barang.deleteMany({
        where: {
            id_cart: cartId
        }
    })

    return cartItem;
}

async function deleteCart(cartId){
    const cart = await prisma.tabel_barang.delete({
        where: {
            id: cartId
        }
    })

    return cart;
}

module.exports = { putProduct, removeProduct, makeCart, cekUserCart, getSingleCart, getAllCart, clearCart, deleteCart }