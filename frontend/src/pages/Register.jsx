import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('❌ Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...userData } = formData;
            const response = await api.post('/users/register', userData);
            
            alert('✅ Регистрация прошла успешно! Теперь войдите в систему.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>📝 Регистрация</h1>
                
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Полное имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Иван Петров"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="ivan@mail.ru"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="89991234567"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{...styles.btn, ...(loading ? styles.btnDisabled : {})}}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p style={styles.loginLink}>
                    Уже есть аккаунт? <Link to="/login" style={styles.link}>Войти</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f5f7fa',
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '20px',
    },
    error: {
        background: '#fee',
        color: '#e74c3c',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontWeight: '500',
        color: '#2c3e50',
        fontSize: '14px',
    },
    input: {
        padding: '12px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'border-color 0.2s',
    },
    btn: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s',
        marginTop: '10px',
    },
    btnDisabled: {
        background: '#bdc3c7',
        cursor: 'not-allowed',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#7f8c8d',
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Register;