import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    goalWeight: '',
    goal: '',
    activityLevel: '',
    dietaryPreferences: [],
    allergies: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.register(formData.name, formData.email, formData.password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="gender"
        placeholder="Gender"
        value={formData.gender}
        onChange={handleChange}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
      />
      <input
        type="number"
        name="goalWeight"
        placeholder="Goal Weight (kg)"
        value={formData.goalWeight}
        onChange={handleChange}
      />
      <input
        type="text"
        name="goal"
        placeholder="Goal"
        value={formData.goal}
        onChange={handleChange}
      />
      <input
        type="text"
        name="activityLevel"
        placeholder="Activity Level"
        value={formData.activityLevel}
        onChange={handleChange}
      />
      <input
        type="text"
        name="dietaryPreferences"
        placeholder="Dietary Preferences (comma-separated)"
        value={formData.dietaryPreferences}
        onChange={(e) =>
          setFormData({
            ...formData,
            dietaryPreferences: e.target.value.split(',').map((item) => item.trim()),
          })
        }
      />
      <input
        type="text"
        name="allergies"
        placeholder="Allergies (comma-separated)"
        value={formData.allergies}
        onChange={(e) =>
          setFormData({
            ...formData,
            allergies: e.target.value.split(',').map((item) => item.trim()),
          })
        }
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;