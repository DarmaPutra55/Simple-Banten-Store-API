const { PrismaClient } = require('@prisma/client');
const { Token } = require('../token/token')
const prisma = new PrismaClient()

class AuthManager{
    constructor(email, username, password){
        this.email = email;
        this.username = username;
        this.password = password;
    }

    async findUser(){
        const user = await prisma.tabel_pengguna.findFirst({
            where: {
                OR:
                    [
                        {
                            email: this.email
                        },
                        {
                            username: this.username
                        }
                    ],
    
                password: this.password
            },
            select: {
                id: true,
                username: true,
                id_role: true,
            }
        });
    
        return user;

    }

    async register(){
        const user = await prisma.tabel_pengguna.create({
            data:{
                username: this.username,
                password: this.password,
                email: this.email,
                id_role: 2
            }
        });

        return user;
    }

    login(userId, id_role, cartId){
        const token = Token.makeToken(userId, this.username, id_role, cartId);
        return token;
    }

    static cekUserToken(userToken){
        const token = new Token(userToken);
        const decode = token.decode();
        return decode;
    }

    static refreshUserToken(userToken){
        const token = new Token(userToken);
        const decode = token.decode();
        return Token.makeToken(decode.id, decode.username, decode.cartId);
    }
}

module.exports = { AuthManager }