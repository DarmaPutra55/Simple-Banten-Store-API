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

async function cekItem(productId, productQuantity){
  const product = await getSingleProduct(productId);
  if(productQuantity > product.stok){
      let error = new Error("Permintaan melibihi stok.");
      error.status = 400;
      throw error;
  }
}

module.exports = {getAllProduct, getSingleProduct, cekItem}
