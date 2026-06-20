const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//путь к бд
const dbPath = path.join(__dirname, '..', 'cars.db');

//подключения
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('- ошибка подключения к базе данных:', err.message);
    } else {
        console.log('+ подключено к SQLite базе данных (cars.db)');
    }
});

module.exports = db;