import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import productRouter from './routes/product';
import orderRouter from './routes/order';
import { requestLogger, errorLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_ADDRESS ?? 'mongodb://127.0.0.1:27017/weblarek');

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);

app.use('/order', orderRouter);

app.use(notFoundHandler);

app.use(errorLogger);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('App listen at port 3000');
});
