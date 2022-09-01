const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


class Product {
    constructor(product){
        this.set(product);
    }

    set(product){
        this.product = product;
    }

    get(){
        return this.product;
    }

    async delete(){

    }

    static async init(productId){
        const product = await prisma.tabel_barang.findUnique({
            where: {
              id: productId,
            },
          });
        
       return product;
    }

    static async create(){
        
    }

}

module.exports = { Product }