const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login...');
    const response = await axios.post('http://localhost:3001/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Status:', response.status);
    console.log('Login Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin(); 