const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class User {
    constructor(id, username, password, email, id_role, profile_img = null){
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.id_role = id_role;
        this.profile_img = profile_img;
    }

    async update(){
        const user = await prisma.tabel_pengguna.update({
            data: {
                username: this.username,
                password: this.password,
                email: this.email,
                id_role: this.id_role,
                profile_img: this.profile_img
            },
            where: {
                id: this.id
            }
        })

        return user;
    }

    static async findUser(username, password) {
        const user = await prisma.tabel_pengguna.findFirst({
            where: {
                AND: [
                    {
                        username: username
                    },
                    {
                        password: password
                    }
                ]


            },
            select: {
                id: true,
                username: true,
                id_role: true,
            }
        });

        return user;

    }

    static async createUser(username, password, email, id_role){
        const user = await prisma.tabel_pengguna.create({
            data: {
                username: username,
                password: password,
                email: email,
                id_role: id_role,
            }
        });

        return user;
    }

}

module.exports = { User }