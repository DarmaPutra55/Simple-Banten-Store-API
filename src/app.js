const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

const app = express();
const products = require('./routes/products')
const login = require('./routes/login')

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser())

app.use('/products', products);
app.use('/login', login);

app.get('*', function(req, res){
    res.status(404).send('Route not found');
});
  
app.listen(3001, () => {
    console.log('listening on port 3001');
  });