const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// GET /api/cars — получить все доступные автомобили
router.get('/', (req, res) => {
    db.all(
        `SELECT * FROM cars WHERE available = 1 ORDER BY price_per_day`,
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

// GET /api/cars/:id — получить автомобиль по ID
router.get('/:id', (req, res) => {
    db.get(
        `SELECT * FROM cars WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (!row) {
                res.status(404).json({ error: 'Автомобиль не найден' });
            } else {
                res.json(row);
            }
        }
    );
});

// POST /api/cars — добавить новый автомобиль (только админ)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
    const { brand, model, year, price_per_day, category, car_class, license_plate, photo_url } = req.body;

    if (!brand || !model || !year || !price_per_day || !category || !car_class || !license_plate) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    db.run(
        `INSERT INTO cars (brand, model, year, price_per_day, category, car_class, license_plate, available, photo_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [brand, model, year, price_per_day, category, car_class, license_plate, photo_url],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Автомобиль с таким госномером уже существует' });
                }
                res.status(500).json({ error: err.message });
            } else {
                res.json({ 
                    id: this.lastID, 
                    message: 'Автомобиль успешно добавлен' 
                });
            }
        }
    );
});

// PUT /api/cars/:id — обновить данные автомобиля (только админ)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
    const { brand, model, year, price_per_day, category, car_class, available, photo_url } = req.body;
    const { id } = req.params;

    db.run(
        `UPDATE cars 
         SET brand = ?, model = ?, year = ?, price_per_day = ?, 
             category = ?, car_class = ?, available = ?, photo_url = ?
         WHERE id = ?`,
        [brand, model, year, price_per_day, category, car_class, available, photo_url, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Автомобиль не найден' });
            } else {
                res.json({ message: 'Автомобиль обновлён' });
            }
        }
    );
});

// DELETE /api/cars/:id — удалить автомобиль (только админ)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM cars WHERE id = ?',
        [id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Автомобиль не найден' });
            } else {
                res.json({ message:'Автомобиль удалён' });
            }
        }
    );
});

module.exports = router;