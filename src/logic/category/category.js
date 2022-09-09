const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Category {

    constructor(id, kategori) {
        this.id = id;
        this.kategori = kategori;
    }

    async update(categoryName) {
        const category = await prisma.tabel_kategori.update({
            where: {
                id: this.id
            },

            data: {
                kategori: categoryName
            }
        })

        if (!category) return false;
        this.kategori = category.kategori;
        return true;
    }

    async delete() {
        const category = await prisma.tabel_kategori.delete({
            where: {
                id: this.id
            }
        })

        return category ? true : false;
    }

    static async find(categoryId) {
        const category = await prisma.tabel_kategori.findFirst({
            where: {
                id: categoryId
            }
        })

        return category;
    }

    static async create(categoryName) {
        const category = await prisma.tabel_kategori.create({
            data: {
                kategori: categoryName
            }
        })

        return category;
    }
}

module.exports = { Category }