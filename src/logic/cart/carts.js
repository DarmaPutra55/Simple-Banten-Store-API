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

    static async init(){
        const carts = await prisma.tabel_cart.findMany();
        return carts;
    }
}

module.exports = { Carts }