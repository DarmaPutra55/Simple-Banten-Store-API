const jwt = require('jsonwebtoken')

class Token{
    constructor(token){
        this.token = token
    }
    
    decode(){
        return jwt.verify(this.token, 'plasma');
    }
    
    static makeToken(id, username, cartId) {
        return jwt.sign({
            "id": id,
            "username": username,
            "cartId": cartId
        }, 'plasma', {
            expiresIn: '7d'
        });
    }
    
}

module.exports = { Token }