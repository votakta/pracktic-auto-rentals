import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function CarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchCarDetails();
    }, [id]);

    const fetchCarDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/cars/${id}`);
            setCar(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки данных об автомобиле');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculatePrice = () => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            if (days <= 0) {
                setTotalPrice(0);
                return;
            }
            
            let price = days * car.price_per_day;
            if (days > 7) {
                price = price * 0.9;
            }
            setTotalPrice(price);
        } else {
            setTotalPrice(0);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            alert('Выберите даты аренды');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Для бронирования необходимо войти в систему');
            navigate('/login');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            alert('Ошибка: пользователь не найден');
            return;
        }

        setBookingLoading(true);
        try {
            const response = await api.post('/rentals', {
                car_id: car.id,
                user_id: user.id,
                start_date: startDate,
                end_date: endDate,
                total_price: totalPrice
            });
            
            alert(`✅ Бронирование успешно создано! ID: ${response.data.id}`);
            navigate('/profile');
        } catch (err) {
            alert('❌ Ошибка бронирования: ' + (err.response?.data?.error || 'Неизвестная ошибка'));
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div style={styles.loading}>Загрузка...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    if (!car) return <div style={styles.error}>Автомобиль не найден</div>;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/')} style={styles.backBtn}>← Назад к списку</button>

            <div style={styles.card}>
                <div style={styles.imageContainer}>
                    <img 
                        src={car.photo_url || '/images/default-car.jpg'} 
                        alt={`${car.brand} ${car.model}`}
                        style={styles.carImage}
                        onError={(e) => {
                            e.target.src = '/images/default-car.jpg';
                        }}
                    />
                </div>
                
                <div style={styles.infoContainer}>
                    <h1 style={styles.title}>{car.brand} {car.model}</h1>
                    
                    <div style={styles.specs}>
                        <div style={styles.specItem}>
                            <span style={styles.specLabel}>Год выпуска</span>
                            <span style={styles.specValue}>{car.year}</span>
                        </div>
                        <div style={styles.specItem}>
                            <span style={styles.specLabel}>Категория</span>
                            <span style={styles.specValue}>{car.category}</span>
                        </div>
                        <div style={styles.specItem}>
                            <span style={styles.specLabel}>Класс</span>
                            <span style={styles.specValue}>{car.car_class}</span>
                        </div>
                        <div style={styles.specItem}>
                            <span style={styles.specLabel}>Госномер</span>
                            <span style={styles.specValue}>{car.license_plate}</span>
                        </div>
                        <div style={styles.specItem}>
                            <span style={styles.specLabel}>Статус</span>
                            <span style={{
                                ...styles.specValue,
                                color: car.available ? '#27ae60' : '#e74c3c'
                            }}>
                                {car.available ? '✅ Доступен' : '❌ Арендован'}
                            </span>
                        </div>
                    </div>

                    <div style={styles.priceBlock}>
                        <span style={styles.price}>{car.price_per_day} ₽</span>
                        <span style={styles.pricePer}>/ день</span>
                    </div>
                </div>
            </div>

            {car.available && (
                <div style={styles.bookingForm}>
                    <h2 style={styles.bookingTitle}>📅 Забронировать автомобиль</h2>
                    
                    <form onSubmit={handleBooking} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата начала:</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (endDate) calculatePrice();
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата окончания:</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    if (startDate) calculatePrice();
                                }}
                                min={startDate || new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        {totalPrice > 0 && (
                            <div style={styles.priceResult}>
                                <p>Итоговая стоимость: <strong>{totalPrice} ₽</strong></p>
                                {totalPrice / car.price_per_day > 7 && (
                                    <p style={styles.discount}>🎉 Применена скидка 10% за долгосрочную аренду</p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                ...styles.bookBtn,
                                ...(bookingLoading || totalPrice === 0 ? styles.bookBtnDisabled : {})
                            }}
                            disabled={bookingLoading || totalPrice === 0}
                        >
                            {bookingLoading ? 'Обработка...' : '✅ Подтвердить бронирование'}
                        </button>
                    </form>
                </div>
            )}

            {!car.available && (
                <div style={styles.unavailable}>
                    <h2>❌ Автомобиль в данный момент арендован</h2>
                    <p>Пожалуйста, выберите другой автомобиль из списка</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#3498db',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '10px 0',
        marginBottom: '20px',
        fontWeight: '500',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '20px',
        color: '#7f8c8d',
    },
    error: {
        textAlign: 'center',
        padding: '50px',
        color: '#e74c3c',
        fontSize: '18px',
    },
    card: {
        display: 'flex',
        gap: '40px',
        background: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    imageContainer: {
        flex: '0 0 300px',
    },
    carImage: {
        width: '300px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    infoContainer: {
        flex: '1',
        minWidth: '250px',
    },
    title: {
        fontSize: '32px',
        margin: '0 0 20px 0',
        color: '#2c3e50',
    },
    specs: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
    },
    specItem: {
        display: 'flex',
        flexDirection: 'column',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '8px',
    },
    specLabel: {
        fontSize: '12px',
        color: '#7f8c8d',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    specValue: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#2c3e50',
        marginTop: '2px',
    },
    priceBlock: {
        marginTop: '10px',
        padding: '15px 0',
        borderTop: '2px solid #ecf0f1',
    },
    price: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    pricePer: {
        fontSize: '18px',
        color: '#7f8c8d',
    },
    bookingForm: {
        background: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    bookingTitle: {
        margin: '0 0 20px 0',
        color: '#2c3e50',
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
    },
    input: {
        padding: '12px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'border-color 0.2s',
    },
    priceResult: {
        background: '#f0f8ff',
        padding: '15px',
        borderRadius: '8px',
        margin: '5px 0',
    },
    discount: {
        color: '#27ae60',
        margin: '5px 0 0 0',
        fontSize: '14px',
    },
    bookBtn: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    bookBtnDisabled: {
        background: '#bdc3c7',
        cursor: 'not-allowed',
    },
    unavailable: {
        textAlign: 'center',
        padding: '40px',
        background: '#fef9e7',
        borderRadius: '15px',
        color: '#e67e22',
    },
};

export default CarDetails;