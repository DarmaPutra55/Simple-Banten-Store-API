const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class CartItems {
    static async clear(){
        const cartItems = await prisma.table_cart_barang.deleteMany({
            where: {
                id_cart: cartId
            }
        })

        return cartItems;
    }
}

module.exports = { CartItems }