import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../utils/api/auth.api';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmType, setConfirmType] = useState('password');
  const [validatePassword, setValidatePassword] = useState('');

  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPassword = () => {
    setConfirmType(confirmType === 'password' ? 'text' : 'password');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword !== password) {
        alert("Passwords do not match!");
        return;
      }

      await signupUser({ name, email, password });
      alert("Signup successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-white/20">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
              type={passwordType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onClick={() =>
                setValidatePassword("Password must include uppercase, lowercase, number, and special character")
              }
              onBlur={() => setValidatePassword('')}
            />
            <span onClick={togglePassword} className="cursor-pointer text-white text-lg">
              {passwordType === 'password' ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          <div className="flex items-center bg-white/20 rounded-lg p-3">
            <input
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              placeholder="Confirm password"
              type={confirmType}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span onClick={toggleConfirmPassword} className="cursor-pointer text-white text-lg">
              {confirmType === 'password' ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Sign Up
          </button>
        </form>

        {validatePassword && (
          <p className="text-red-400 text-sm mt-2">{validatePassword}</p>
        )}

        <p className="text-gray-300 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
