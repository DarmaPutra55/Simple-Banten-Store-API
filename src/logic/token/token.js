const jwt = require('jsonwebtoken')
const key = process.env.SECRET_KEY;

class Token{
    constructor(token){
        this.token = token
    }
    
    decode(){
        return jwt.verify(this.token, key);
    }
    
    static makeToken(id, username, id_role, cartId) {
        return jwt.sign({
            "id": id,
            "username": username,
            "id_role": id_role,
            "cartId": cartId
        }, key, {
            expiresIn: '7d'
        });
    }
    
}

module.exports = { Token }