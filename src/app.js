import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(json());
app.use(cors());
app.use(morgan('combined'));

app.get('/products', (req, res) => {
    res.send();
});

app.listen(3001, () => {
    console.log('listening on port 3001');
  });