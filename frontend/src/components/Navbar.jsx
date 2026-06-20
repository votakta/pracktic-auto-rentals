import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>🚗 Аренда авто</Link>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Главная</Link>
                    {token ? (
                        <>
                            <span style={styles.user}>👤 {user.name || 'Пользователь'}</span>
                            <Link to="/profile" style={styles.link}>Профиль</Link>
                            <button onClick={handleLogout} style={styles.logoutBtn}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Вход</Link>
                            <Link to="/register" style={styles.link}>Регистрация</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: '#2c3e50',
        padding: '15px 0',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
    },
    logo: {
        color: 'white',
        fontSize: '24px',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    links: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'color 0.2s',
    },
    user: {
        color: '#1abc9c',
        fontWeight: 'bold',
    },
    logoutBtn: {
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background 0.2s',
    },
};

export default Navbar;