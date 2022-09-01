const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class CartItem{
    constructor(cartItem){
        this.set(cartItem)
    }

    set(cartItem){
        this.cartItem = cartItem
    }

    get(){
        return this.cartItem;
    }

    async delete(){
        const cartItem = await prisma.table_cart_barang.delete({
            where: {
                id: this.cartItem.id
            }
        })
        
        this.cartItem = {};
    }

    static async init(cartItemId){
        const cartItem = await prisma.table_cart_barang.findUnique({
            where:{
                id: cartItemId
            }
        })

        return cartItem;
    }

    static async create(cartId, productId, itemQuantitiy){
        const cartItem = prisma.table_cart_barang.create({
            data: {
                id_cart: cartId,
                id_barang: productId,
                jumlah: itemQuantitiy
            }
        })
                    
        return cartItem;
    }
}

module.exports = { CartItem }