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
            }
        });
    
        return user;

    }

    async register(){
        const user = await prisma.tabel_pengguna.create({
            data:{
                username: this.email,
                password: this.password,
                email: this.email,
                id_role: 2
            }
        });

        return user;
    }

    login(userId){
        const token = Token.makeToken(userId, user.username);
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
        return Token.makeToken(decode.id, decode.username);
    }
}

module.exports = { AuthManager }