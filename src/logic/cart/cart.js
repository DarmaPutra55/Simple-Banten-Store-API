const { PrismaClient } = require('@prisma/client');
const { CartItem } = require('../cartItem/cartItem');
const { CartItems } = require('../cartItem/cartItems');
const prisma = new PrismaClient()

class Cart{
    constructor(cart){
        this.set(cart);
    }

    set(cart){
        this.cart = cart;
    }

    get(){
        return this.cart;
    }

    async delete(){
        const cart = await prisma.tabel_barang.delete({
            where: {
                id: this.cart.id
            }
        })
    
        this.cart = {};
    }

    async putProduct(productId, itemQuantitiy){
        const cartItem = await CartItem.create(this.cart.id, productId, itemQuantitiy);
    }

    async removeProduct(cartItemId){
        const cartItem = new CartItem(await CartItem.init(cartItemId));
        await cartItem.delete();
    }

    async clearCart(){
        const cartItems = CartItems.deletes(this.cart.id);
    }

    static async init(cartId){
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

    static async create(userId){
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


}

/*async function cekUserCart(cartId, userId){
    const cart = await prisma.tabel_cart.findFirst({
        where: {
            AND: [
                    {id: cartId},
                    {id_pengguna: userId}
                ]
            
        }
    })

    return cart;
}*/

module.exports = { Cart }