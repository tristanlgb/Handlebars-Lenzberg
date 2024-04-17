import express from 'express';
import http from 'http';
import exphbs from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import fs from 'fs';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const port = 8080;


const cartsFilePath = './files/cart.json';


if (!fs.existsSync(cartsFilePath)) {
    fs.writeFileSync(cartsFilePath, '[]');
}


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use((err, req, res, next) => {
    console.error(err);
    const errorMessage = err.message || 'Internal Server Error';
    const statusCode = err.statusCode || 500;
    const errorDetails = err.details || null;
    res.status(statusCode).json({ error: errorMessage, details: errorDetails });
});


io.on('connection', (socket) => {
    console.log('A user connected');

   
    socket.on('updateProducts', async () => {
        const products = await productManager.getAllProducts();
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});