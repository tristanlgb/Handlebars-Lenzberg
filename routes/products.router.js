import express from 'express';
import { ProductManager } from '../managers/productManager.js';
import { io } from '../app.js'; 

const router = express.Router();
const productsFile = './files/products.json';
const productManager = new ProductManager(productsFile);


router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = await productManager.getAllProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (err) {
    next(err);
  }
});


router.get('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);


    io.emit('updateProducts');

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const product = await productManager.updateProduct(productId, updatedFields);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    await productManager.deleteProduct(productId);

    io.emit('updateProducts');

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;