import { Schema, model } from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    unique: true,
    required: true,
  },
  image: {
    type: {
      fileName: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default model<IProduct>('product', productSchema);
