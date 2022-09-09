const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Categories {
    static async finds() {
        const categories = await prisma.tabel_kategori.findMany({})
        return categories;
    }

    static async clear() {
        const categories = await prisma.tabel_kategori.deleteMany({})
        return categories;
    }

    static async deletes(categoryIds) {
        const categories = await prisma.tabel_kategori.deleteMany({
            where: {
                id: {
                    in: categoryIds
                }
            }
        })
        return categories;
    }
}

module.exports = { Categories }