import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <img
                src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
                alt="Funny not found"
                style={{ width: '300px', marginTop: '20px' }}
            />
        </div>
    );
};

export default NotFoundPage;