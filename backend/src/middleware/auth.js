const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt';

//проверка наличия и валидности токена
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: ' - токен не предоставлен' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '- неверный формат токена' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: ' - недействительный или просроченный токен' });
    }
};

//проверка прав администратора
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: ' - Доступ запрещён. Требуются права администратора' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };