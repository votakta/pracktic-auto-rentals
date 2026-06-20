const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// POST /api/rentals — создать новую аренду
router.post('/', verifyToken, (req, res) => {
    const { car_id, user_id, start_date, end_date, total_price } = req.body;

    if (!car_id || !user_id || !start_date || !end_date || !total_price) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    //проверка занят ли автомобиль на выбранные даты
    db.all(
        `SELECT * FROM rentals 
         WHERE car_id = ? 
         AND status IN ('новое', 'подтверждено', 'активно')
         AND start_date <= ? AND end_date >= ?`,
        [car_id, end_date, start_date],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (rows.length > 0) {
                return res.status(400).json({ 
                    error: 'Автомобиль уже забронирован на выбранные даты' 
                });
            }

            //создание аренды
            db.run(
                `INSERT INTO rentals (car_id, user_id, start_date, end_date, total_price, status) 
                 VALUES (?, ?, ?, ?, ?, 'новое')`,
                [car_id, user_id, start_date, end_date, total_price],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Обновление статуса автомобиля
                    db.run('UPDATE cars SET available = 0 WHERE id = ?', [car_id]);

                    res.json({ 
                        id: this.lastID, 
                        message: 'Бронирование успешно создано' 
                    });
                }
            );
        }
    );
});

// PUT /api/rentals/:id/return — завершить аренду (возврат авто)
router.put('/:id/return', verifyToken, (req, res) => {
    const { id } = req.params;

    db.get('SELECT car_id FROM rentals WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Аренда не найдена' });
        }

        db.run(
            `UPDATE rentals SET status = 'завершено' WHERE id = ?`,
            [id],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.run('UPDATE cars SET available = 1 WHERE id = ?', [row.car_id]);

                res.json({ message: 'Аренда завершена, автомобиль возвращён' });
            }
        );
    });
});

// GET /api/rentals/user/:userId — получить аренды пользователя
router.get('/user/:userId', verifyToken, (req, res) => {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }

    db.all(
        `SELECT r.*, c.brand, c.model, c.photo_url 
         FROM rentals r
         JOIN cars c ON r.car_id = c.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

// GET /api/rentals/all — получить все аренды (только админ)
router.get('/all', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора' });
    }

    db.all(
        `SELECT r.*, u.name as user_name, c.brand, c.model 
         FROM rentals r
         JOIN users u ON r.user_id = u.id
         JOIN cars c ON r.car_id = c.id
         ORDER BY r.created_at DESC`,
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

module.exports = router;