import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            const response = await api.post('/users/login', formData);
            
            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            alert('✅ Вход выполнен успешно!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при входе');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🔐 Вход в систему</h1>
                
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="admin@cars.ru"
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

                    <button 
                        type="submit" 
                        style={{...styles.btn, ...(loading ? styles.btnDisabled : {})}}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>

                <p style={styles.registerLink}>
                    Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрироваться</Link>
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
        maxWidth: '400px',
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
        gap: '15px',
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
        background: '#3498db',
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
    registerLink: {
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

export default Login;