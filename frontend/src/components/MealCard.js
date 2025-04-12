import React from 'react';

const MealCard = ({ meal }) => {
    const defaultImage = '/images/default-meal.jpg'; // Path to default image

    return (
        <div className="meal-card">
            <img
                src={meal.image || defaultImage}
                alt={meal.name}
                onError={(e) => (e.target.src = defaultImage)}
            />
            <h3>{meal.name}</h3>
            {/* ...existing code... */}
        </div>
    );
};

export default MealCard;