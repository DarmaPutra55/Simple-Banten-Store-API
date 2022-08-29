const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

async function getUser(inputEmail, inputUsername, inputPassword) {
    const user = await prisma.tabel_pengguna.findFirst({
        where: {
            OR:
                [
                    {
                        email: inputEmail
                    },
                    {
                        username: inputUsername
                    }
                ],

            password: inputPassword
        },
        select: {
            id: true,
            username: true,
        }
    });

    return user;
}

async function register(inputEmail, inputUsername, inputPassword){
    const user = await prisma.tabel_pengguna.create({
        data:{
            username: inputUsername,
            password: inputPassword,
            email: inputEmail,
            id_role: 2
        }
    });
    

    return user;
}

async function cekUser(userID) {
    const user = await prisma.tabel_pengguna.findUnique({
        where:{
            id: userID
        }
    })

    return user ? true : false
}

function makeToken(id, username) {
    return jwt.sign({
        "id": id,
        "username": username,
    }, 'plasma', {
        expiresIn: '1h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, 'plasma')
}

module.exports = { getUser, register, cekUser, makeToken, verifyToken }