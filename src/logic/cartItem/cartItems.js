const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class CartItems {
    static async clear(cartId){
        const cartItems = await prisma.table_cart_barang.deleteMany({
            where: {
                id_cart: cartId
            }
        })

        return cartItems;
    }

    static async deletes(itemIds){
        const cartItems = await prisma.table_cart_barang.deleteMany({
            where:{
                id: {
                    in: itemIds
                }
            }
        })

        return cartItems;
    }

    static async finds(cartId){
        const cartItems = await prisma.table_cart_barang.findMany({
            where: {
                id_cart: cartId
            }
        })

        return cartItems;
    }
}

module.exports = { CartItems }