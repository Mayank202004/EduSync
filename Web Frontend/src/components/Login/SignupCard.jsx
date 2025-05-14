import React from 'react'
import { loginApi } from '@/services/authService';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Link,useNavigate } from 'react-router-dom';

function SignupCard({switchToLogin}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      // To be implemented 
    };


  return (
    <div className="min-h-screen w-96 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">EduSync</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md p-3 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-2 text-sm text-center text-gray-600">
          Already have an  account account?{" "}
          <button
            onClick={switchToLogin} // Swap signupCard with loginCard
            className="text-blue-500 hover:underline"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}

export default SignupCard