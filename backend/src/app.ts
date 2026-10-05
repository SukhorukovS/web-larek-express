import express from 'express';
import mongoose from 'mongoose';

import productRouter from './routes/product';

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_ADDRESS ?? 'mongodb://127.0.0.1:27017/weblarek');

app.use('/product', productRouter);

app.listen(3000, () => {
  console.log('App listen at port 3000');
});
