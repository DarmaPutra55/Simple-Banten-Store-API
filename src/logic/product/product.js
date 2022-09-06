const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


class Product {
    constructor(id, nama, deskripsi, id_kategori, harga, stok, terjual, diskon, gambar){
        this.id = id;
        this.nama = nama;
        this.deskripsi = deskripsi;
        this.id_kategori = id_kategori;
        this.harga = harga;
        this.stok = stok;
        this.terjual = terjual;
        this.diskon = diskon;
        this.gambar = gambar;
    }

    async update(nama, deskripsi, id_kategori, harga, stok, terjual, diskon, gambar){
        const product = await prisma.tabel_barang.update({
            where: {
                id: this.id
            },
            data: {
                nama: nama || this.nama,
                deskripsi: deskripsi || this.deskripsi,
                id_kategori: id_kategori || this.id_kategori,
                harga: harga || this.harga,
                stok: stok || this.stok,
                terjual: terjual || this.terjual,
                diskon: diskon || this.diskon,
                gambar: gambar || this.gambar
            }
        })

        if(!product) return false;

        this.nama = product.nama;
        this.deskripsi = product.deskripsi;
        this.id_kategori = product.id_kategori;
        this.harga = product.harga;
        this.stok = product.stok;
        this.terjual = product.terjual;
        this.diskon = product.diskon;
        this.gambar = product.gambar;

        return true;
    }

    async delete(){
        const product = await prisma.tabel_barang.delete({
            where:{
                id: this.id
            }
        })

        return product ? true : false;
    }

    static async find(productId){
        const product = await prisma.tabel_barang.findUnique({
            where: {
              id: productId,
            },
          });
        
       return product;
    }

    static async create(nama, deskripsi, id_kategori, harga, stok, terjual, diskon, gambar){
        const product = await prisma.tabel_barang.create({
            data:{
                nama: nama,
                deskripsi: deskripsi,
                id_kategori: id_kategori,
                harga: harga,
                stok: stok,
                terjual: terjual,
                diskon: diskon || 0,
                gambar: gambar
            }
        })

        return product;
    }

}

module.exports = { Product }