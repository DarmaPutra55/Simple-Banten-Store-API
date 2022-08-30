const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

const app = express();
const products = require('./routes/products');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const cart = require('./routes/cart');

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser())

app.use('/products', products);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/carts', cart);

app.get('*',  (req, res)=>{
    res.status(404).json({
        ok: false,
        error: "Route is not found."
    });
});

app.use((error, req, res, next)=>{
    const errStatus = error.status || 400;
    res.status(errStatus).json({
        "ok" : false,
        "error" : error.message
    });
});
  
app.listen(3001, () => {
    console.log('listening on port 3001');
  });