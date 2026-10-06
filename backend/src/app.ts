import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import config from './config';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import { requestLogger, errorLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';

const { PORT, DB_ADDRESS } = config;

const app = express();

app.use(express.json());

mongoose.connect(DB_ADDRESS);

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);

app.use('/order', orderRouter);

app.use(notFoundHandler);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listen at port ${PORT}`);
});
