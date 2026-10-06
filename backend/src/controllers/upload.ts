import { Request, Response, NextFunction } from 'express';

import BadRequestError from '../errors/BadRequestError';

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new BadRequestError('Файл не был передан'));
  }

  const { filename, originalname } = req.file;

  return res.status(201).send({
    fileName: `/images/${filename}`,
    originalName: originalname,
  });
};

export default uploadFile;
