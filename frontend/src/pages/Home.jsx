import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('все');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await api.get('/cars');
            setCars(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setLoading(false);
        }
    };

    const filteredCars = filter === 'все' 
        ? cars 
        : cars.filter(car => car.category === filter);

    if (loading) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Доступные автомобили</h1>
            
            <div style={styles.filters}>
                <button 
                    onClick={() => setFilter('все')}
                    style={{...styles.filterBtn, ...(filter === 'все' ? styles.active : {})}}
                >
                    Все
                </button>
                <button 
                    onClick={() => setFilter('легковой')}
                    style={{...styles.filterBtn, ...(filter === 'легковой' ? styles.active : {})}}
                >
                    Легковые
                </button>
                <button 
                    onClick={() => setFilter('грузовой')}
                    style={{...styles.filterBtn, ...(filter === 'грузовой' ? styles.active : {})}}
                >
                    Грузовые
                </button>
            </div>

            <div style={styles.carsGrid}>
                {filteredCars.length === 0 ? (
                    <p style={styles.noCars}>Нет доступных автомобилей</p>
                ) : (
                    filteredCars.map(car => (
                        <div key={car.id} style={styles.carCard}>
                            <img 
                                src={car.photo_url || '/images/default-car.jpg'} 
                                alt={`${car.brand} ${car.model}`}
                                style={styles.carImage}
                                onError={(e) => {
                                    e.target.src = '/images/default-car.jpg';
                                }}
                            />
                            <h3 style={styles.carTitle}>{car.brand} {car.model}</h3>
                            <p style={styles.carYear}>Год: {car.year}</p>
                            <p style={styles.carClass}>Класс: {car.car_class}</p>
                            <p style={styles.price}>{car.price_per_day} ₽/день</p>
                            <Link to={`/car/${car.id}`}>
                                <button style={styles.detailsBtn}>Подробнее</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        fontSize: '32px',
        marginBottom: '10px',
    },
    filters: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        margin: '20px 0',
    },
    filterBtn: {
        padding: '10px 25px',
        border: '2px solid #2c3e50',
        borderRadius: '25px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.3s',
    },
    active: {
        background: '#2c3e50',
        color: 'white',
    },
    carsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
        marginTop: '20px',
    },
    carCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    carCardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
    carImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    carTitle: {
        fontSize: '20px',
        margin: '10px 0 5px 0',
        color: '#2c3e50',
    },
    carYear: {
        color: '#7f8c8d',
        margin: '5px 0',
        fontSize: '14px',
    },
    carClass: {
        color: '#7f8c8d',
        margin: '5px 0',
        fontSize: '14px',
    },
    price: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '10px 0',
    },
    detailsBtn: {
        background: '#3498db',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        marginTop: '10px',
        width: '100%',
        transition: 'background 0.2s',
    },
    loading: {
        textAlign: 'center',
        fontSize: '20px',
        padding: '50px',
        color: '#7f8c8d',
    },
    noCars: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '50px',
        color: '#7f8c8d',
    },
};

export default Home;