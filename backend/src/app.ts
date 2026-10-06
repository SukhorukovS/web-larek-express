import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';

import config from './config';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';

const { PORT, DB_ADDRESS } = config;

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(DB_ADDRESS);

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

app.use('/product', productRouter);

app.use('/order', orderRouter);

app.use(notFoundHandler);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listen at port ${PORT}`);
});
