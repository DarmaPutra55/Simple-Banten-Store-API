const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class CartItem{
    constructor(id, id_cart, id_barang, jumlah, checked){
        this.id = id;
        this.id_cart = id_cart;
        this.id_barang = id_barang;
        this.jumlah = jumlah;
        this.checked = checked;
    }

    async update(id_cart, id_barang, jumlah, checked){
        const cartItem = await prisma.table_cart_barang.update({
            where:{
                id: this.id
            },

            data: {
                id_cart: id_cart || this.id_cart,
                id_barang: id_barang || this.id_barang,
                jumlah: jumlah || this.jumlah,
                checked: checked || this.checked
            }
        })

        if(!cartItem) return false;

        this.id_cart = cartItem.id_cart;
        this.id_barang = cartItem.id_barang;
        this.jumlah = cartItem.jumlah;
        this.checked = cartItem.checked;

        return true;
    }

    async delete(){
        const cartItem = await prisma.table_cart_barang.delete({
            where: {
                id: this.id
            }
        })

        return cartItem ? true : false;
    }

    static async find(cartItemId){
        const cartItem = await prisma.table_cart_barang.findUnique({
            where:{
                id: cartItemId
            }
        })

        return cartItem;
    }

    static async create(id_cart, id_barang, jumlah){
        const cartItem = prisma.table_cart_barang.create({
            data: {
                id_cart: id_cart,
                id_barang: id_barang,
                jumlah: jumlah
            }
        })
                    
        return cartItem;
    }
}

module.exports = { CartItem }