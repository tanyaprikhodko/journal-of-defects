import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', overflow: 'hidden' }}>
            <h1>404 - Сторінку не знайдено</h1>
            <p>Ой! Сторінка, яку ви шукаєте, не існує.</p>
            <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY3OGxmdGozMTQwamJvbDQ1dXE4ajJwMTVnMHF1MTJvcWx4NXdjdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UoeaPqYrimha6rdTFV/giphy.gif"
            alt="Not found"
            style={{ width: '100vw', height: '75vh' }}
            />
        </div>
    );
};

export default NotFoundPage;