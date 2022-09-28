const { PrismaClient } = require('@prisma/client');
const { CartItem } = require('../cartItem/cartItem');
const { CartItems } = require('../cartItem/cartItems');
const prisma = new PrismaClient()

class Cart{
    constructor(id, id_pengguna){
       this.id = id;
       this.id_pengguna = id_pengguna;
    }

    async delete(){
        const cart = await prisma.tabel_barang.delete({
            where: {
                id: this.id
            }
        })
    
        return cart ? true : false;
    }

    async putProduct(productId, itemQuantitiy){
        const cartItem = await CartItem.create(this.id, productId, itemQuantitiy);
        return cartItem ? true : false;
    }

    async updateCartItem(id, id_cart, id_barang, jumlah, checked){
        const fetchedCartItem = await CartItem.find(id);
        if(!fetchedCartItem) throw new Error("Barang tidak ditemukan di cart!");
        const cartItem = new CartItem(fetchedCartItem.id, fetchedCartItem.id_cart, fetchedCartItem.id_barang, fetchedCartItem.jumlah, fetchedCartItem.checked);
        await cartItem.update(id_cart, id_barang, jumlah, checked);
        return cartItem;
    }

    async removeProduct(cartItemId){
        const fetchedCartItem = await CartItem.find(cartItemId);
        if(!fetchedCartItem) throw new Error("Barang tidak ditemukan di cart!");
        const cartItem = new CartItem(fetchedCartItem.id, fetchedCartItem.id_cart, fetchedCartItem.id_barang, fetchedCartItem.jumlah, fetchedCartItem.checked);
        await cartItem.delete();
    }

    async clearCart(){
        const cartItems = CartItems.clear(this.id);
        return cartItems ? true : false;
    }

    static async find(cartId){
        const cart = await prisma.tabel_cart.findUnique({
            where: {
                id: cartId
            },
            include: {
                table_cart_barang: {
                    select: {
                        id: true,
                        id_barang: true,
                        jumlah: true,
                        checked: true
                    }
                },
            }
        })
    
        return cart;
    }

    static async findCartBasedOnUserId(userId){
        const cart = await prisma.tabel_cart.findFirst({
            where: {
                id_pengguna: userId
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
                        jumlah: true,
                        checked: true
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