import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUsername }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        email, 
        password,
      }

      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      console.log("Successfully submitted data: ", response.data);
      setIsLoggedIn(true);
      setUsername(response.data.user.name);

      setEmail('');
      setPassword('');

      navigate('/');
    } catch (error) {
      console.log("Error submitting form: ", error);
    }
  }

  const handleSignup = () => {
    navigate('/signup');
  }
    
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            placeholder='Enter email'
            value={email}
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input 
            placeholder='Enter password'
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type='submit'>Login</button>
        </div>
      </form>
      <button onClick={handleSignup}>Signup</button>
    </div>
  )
}

export default Login;
