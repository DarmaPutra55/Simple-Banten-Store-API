const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Products {
  static async finds(searchParams, paginationParams) {
    const products = await prisma.tabel_barang.findMany({
      ...paginationParams,
      include: {
        tabel_kategori: {
          select: {
            kategori: true
          }
        }
      },
      where: searchParams,
    })

    return products;
  }

  static async findsBasedOnCategoryName(categoryName) {
    const products = await prisma.tabel_barang.findMany({
      include: {
        tabel_kategori: {
          select: {
            kategori: true
          }
        }
      },

      where: {
        tabel_kategori: {
          kategori: categoryName
        }
      }
    })

    return products;
  }

  static async deletes(productIds) {
    const products = await prisma.tabel_barang.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    })

    return products
  }

  static async clear(){
    const products = await prisma.tabel_barang.deleteMany({})
    return products;
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
