const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getAllProduct(){
    const products = await prisma.tabel_barang.findMany();
    return products;
}

async function getSingleProduct(productID){
    const product = await prisma.tabel_barang.findUnique({
        where: {
          id: productID,
        },
      });
    
    return product;
}

module.exports = {getAllProduct, getSingleProduct}
