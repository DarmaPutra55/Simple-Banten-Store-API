const jwt = require('jsonwebtoken')

class Token{
    constructor(token){
        this.token = token
    }
    
    decode(){
        return jwt.verify(this.token, 'plasma');
    }
    
    static makeToken(id, username, id_role, cartId) {
        return jwt.sign({
            "id": id,
            "username": username,
            "id_role": id_role,
            "cartId": cartId
        }, 'plasma', {
            expiresIn: '7d'
        });
    }
    
}

module.exports = { Token }