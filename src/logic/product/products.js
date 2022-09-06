const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Products{
  constructor(products){
    this.sets(products);
  }

  sets(products){
    this.products =  products;
  }
  
  gets(){
    return this.products;
  }

  async deletes(){

  }

  static async finds(){
    const products = await prisma.tabel_barang.findMany();
    return products;
  }

  static async creates(){

  }

}



/*async function cekProduct(productId, productQuantity){
  const product = await getSingleProduct(productId);
  if(productQuantity > product.stok){
      let error = new Error("Permintaan melibihi stok.");
      error.status = 400;
      throw error;
  }
}*/

module.exports = { Products }
