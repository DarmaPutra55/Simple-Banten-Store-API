const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Carts{
    constructor(carts){
        this.set(carts);
    }

    set(carts){
        this.carts = carts;
    }

    gets(){
        return this.carts;
    }

    static async find(option = {}){
        const carts = await prisma.tabel_cart.findMany(option);
        return carts;
    }
}

module.exports = { Carts }