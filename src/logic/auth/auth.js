const { Token } = require('../token/token')
const { User } = require('../user/user')

class AuthManager {
    constructor(username, password, email = null) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    async register() {
        const user = await User.createUser(this.username, this.password, this.email, 2);
        return user;
    }

    login(userId, id_role, cartId) {
        const token = Token.makeToken(userId, this.username, id_role, cartId);
        return token;
    }

    static cekUserToken(userToken) {
        const token = new Token(userToken);
        const decode = token.decode();
        return decode;
    }

    static refreshUserToken(userToken) {
        const token = new Token(userToken);
        const decode = token.decode();
        return Token.makeToken(decode.id, decode.username, decode.cartId);
    }
}

module.exports = { AuthManager }