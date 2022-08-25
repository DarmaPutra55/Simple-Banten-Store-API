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
        }
    });

    return user;
}

function makeToken(id, username) {
    return jwt.sign({
        userId: id,
        userName: username,
    }, 'plasma', {
        expiresIn: '1h'
    });
}

function verifyToken(token) {
    return jwt.verify(token, 'plasma')
}

module.exports = { getUser, makeToken, verifyToken }