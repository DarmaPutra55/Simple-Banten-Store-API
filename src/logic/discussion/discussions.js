const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Discussions{
    static async countDiscussionBasedOnProductId(productId){
        const discussionCount = await prisma.tabel_ulasan.count({
            where:{
                id_barang: productId
            }
        })

        return discussionCount;
    }
}

module.exports = { Discussions }