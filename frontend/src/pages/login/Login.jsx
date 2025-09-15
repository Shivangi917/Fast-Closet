import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../utils/api/auth.api';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleToggle = () => {
    setShow(!show);
    setType(show ? 'password' : 'text');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await loginUser({ email, password });
      login(user, token);
      navigate('/');
    } catch (error) {
      alert("Invalid user credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-white/20">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex items-center bg-white/20 rounded-lg p-3">
            <input
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              placeholder="Enter password"
              type={type}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={handleToggle} className="cursor-pointer text-white text-lg">
              {show ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
