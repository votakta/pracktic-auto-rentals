import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Profile() {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await api.get(`/rentals/user/${user.id}`);
            setRentals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки аренд:', error);
            setLoading(false);
        }
    };

    if (!token) {
        return <div style={styles.container}>Перенаправление на вход...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>👤 Личный кабинет</h1>
            
            <div style={styles.userInfo}>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Телефон:</strong> {user.phone}</p>
                <p><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Клиент'}</p>
            </div>

            <h2 style={styles.subtitle}>📋 История аренд</h2>

            {loading ? (
                <p>Загрузка...</p>
            ) : rentals.length === 0 ? (
                <p style={styles.noRentals}>У вас пока нет арендованных автомобилей</p>
            ) : (
                <div style={styles.rentalsList}>
                    {rentals.map(rental => (
                        <div key={rental.id} style={styles.rentalCard}>
                            <div>
                                <strong>{rental.brand} {rental.model}</strong>
                                <p>С: {rental.start_date} по: {rental.end_date}</p>
                            </div>
                            <div style={styles.rentalInfo}>
                                <span style={styles.rentalPrice}>{rental.total_price} ₽</span>
                                <span style={{
                                    ...styles.rentalStatus,
                                    ...(rental.status === 'завершено' ? styles.statusCompleted : 
                                        rental.status === 'активно' ? styles.statusActive : 
                                        styles.statusNew)
                                }}>
                                    {rental.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    title: {
        color: '#2c3e50',
        marginBottom: '30px',
    },
    subtitle: {
        color: '#2c3e50',
        marginTop: '40px',
        marginBottom: '20px',
    },
    userInfo: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    noRentals: {
        color: '#7f8c8d',
        fontSize: '16px',
    },
    rentalsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    rentalCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
    },
    rentalInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '5px',
    },
    rentalPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    rentalStatus: {
        fontSize: '14px',
        fontWeight: '500',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    statusCompleted: {
        background: '#d5f5e3',
        color: '#27ae60',
    },
    statusActive: {
        background: '#fdebd0',
        color: '#e67e22',
    },
    statusNew: {
        background: '#d6eaf8',
        color: '#2980b9',
    },
};

export default Profile;