const jwt = require('jsonwebtoken')

class Token{
    constructor(token){
        this.token = token
    }
    
    decode(){
        return jwt.verify(this.token, 'plasma');
    }
    
    static makeToken(id, username) {
        return jwt.sign({
            "id": id,
            "username": username,
        }, 'plasma', {
            expiresIn: '7d'
        });
    }
    
}

module.exports = { Token }