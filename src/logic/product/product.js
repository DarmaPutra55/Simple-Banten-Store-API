const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


class Product {
    constructor(id, nama, deskripsi, kategori, harga, stok, terjual, diskon, gambar, rating, ulasan = 0){
        this.id = id;
        this.nama = nama;
        this.deskripsi = deskripsi;
        this.kategori = kategori;
        this.harga = harga;
        this.stok = stok;
        this.ulasan = ulasan;
        this.terjual = terjual;
        this.diskon = diskon;
        this.gambar = gambar;
        this.rating = rating;
    }

    async update(nama, deskripsi, kategori, harga, stok, terjual, diskon, gambar, rating){
        const fetchedKategori = await prisma.tabel_kategori.findFirst({
            where: {
                kategori: kategori || this.kategori
            }
        })

        if(!fetchedKategori) throw new Error("Kategori tidak ditemukan!");

        const product = await prisma.tabel_barang.update({
            where: {
                id: this.id
            },
            data: {
                nama: nama || this.nama,
                deskripsi: deskripsi || this.deskripsi,
                id_kategori: fetchedKategori.id,
                harga: harga || this.harga,
                stok: stok || this.stok,
                terjual: terjual || this.terjual,
                diskon: diskon || this.diskon,
                gambar: gambar || this.gambar,
                rate: rating.rate || this.rating.rate,
                jumlah_rating: rating.jumlah_rating || this.rating.jumlah_rating
            }
        })

        if(!product) return false;

        this.nama = product.nama;
        this.deskripsi = product.deskripsi;
        this.kategori = fetchedKategori.kategori;
        this.harga = product.harga;
        this.stok = product.stok;
        this.terjual = product.terjual;
        this.diskon = product.diskon;
        this.gambar = product.gambar;
        this.rating = {
            "rate": product.rate,
            "jumlah_rating": product.jumlah_rating
        }

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
            include:{
                tabel_kategori: {
                    select: {
                        kategori: true
                    }
                }
            }
          });
        
       return product;
    }

    static async create(nama, deskripsi, kategori, harga, stok, terjual, diskon, gambar){
        const fetchedKategori = await prisma.tabel_kategori.findFirst({
            where: {
                kategori: kategori
            }
        })

        if(!fetchedKategori) throw new Error("Kategori tidak ditemukan!");

        const product = await prisma.tabel_barang.create({
            data:{
                nama: nama,
                deskripsi: deskripsi,
                id_kategori: fetchedKategori.id,
                harga: harga,
                stok: stok,
                terjual: terjual,
                diskon: diskon || 0,
                gambar: gambar,
            }
        })

        return product;
    }

}

module.exports = { Product }