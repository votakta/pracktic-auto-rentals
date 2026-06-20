const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//подключение middleware
app.use(cors());
app.use(express.json());

//подключение маршрутов
const carsRoutes = require('./routes/cars');
const rentalsRoutes = require('./routes/rentals');
const usersRoutes = require('./routes/users');

app.use('/api/cars', carsRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/users', usersRoutes);

//проверка работоспособности сервера
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Сервер работает',
        timestamp: new Date().toISOString()
    });
});

//запуск сервера
app.listen(PORT, () => {
    console.log(`сервер запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`доступные маршруты:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/cars`);
    console.log(`   - POST /api/cars`);
    console.log(`   - POST /api/rentals`);
    console.log(`   - POST /api/users/register`);
    console.log(`   - POST /api/users/login`);
});