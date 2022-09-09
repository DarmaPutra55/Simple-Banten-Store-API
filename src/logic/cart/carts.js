const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Carts{
    static async finds(){
        const carts = await prisma.tabel_cart.findMany({});
        return carts;
    }
}

module.exports = { Carts }