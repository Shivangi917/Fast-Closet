import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsLoggedIn, setUsername }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        name,
        email,
        password,
      };

      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      console.log('Successfully submitted data: ', response.data);

      setIsLoggedIn(true);
      setUsername('response.data.user.name');

      navigate('/');
    } catch (error) {
      console.log('Error submitting form: ', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Enter name"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Enter email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Enter password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Signup</button>
        </div>
      </form>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Signup;
