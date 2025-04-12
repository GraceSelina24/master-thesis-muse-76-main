import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('/api/fitnessActivities/today');
                setActivities(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchActivities();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <section>
                <h2>Today's Activities</h2>
                <ul>
                    {activities.map(activity => (
                        <li key={activity._id}>
                            {activity.name} - {activity.duration} mins - {activity.caloriesBurned} cal
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;