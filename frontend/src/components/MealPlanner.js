import React from 'react';
import MealCard from './MealCard';

const MealPlanner = ({ meals }) => {
    return (
        <div className="meal-planner">
            <section>
                <h2>Today's Plan</h2>
                <div className="meal-cards">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => (
                        <MealCard key={mealType} meal={meals[mealType.toLowerCase()]} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MealPlanner;