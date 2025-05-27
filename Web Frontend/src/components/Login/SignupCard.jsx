import React from 'react'
import { loginApi, signupApi } from '@/services/authService';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function SignupCard({switchToLogin}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      const signupPromise = signupApi(fullName,username, email,password, role);

    // Toast based on promise state
    toast.promise(
      signupPromise,
      {
        loading: 'Creating Account...',
        success: (response) => {
          return `Account Created! Proceed to login.`;
        },
        error: (err) => {
          if(err?.response?.data?.message === 'Validation error'){
            setErrors(err.response.data.data);
          }
          return err?.response?.data?.message || 'Signup failed';
        },
      }
    );

    try {
    const response = await signupPromise;

    if (response.statusCode === 201) {
      switchToLogin(); // Swap signupcard to loginCard
      
    } 
  } catch (err) {
    // Already handled by toast
  }
    };


  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">EduSync</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setErrors(prev => ({ ...prev, fullName: null })); // Clear error on change
            }}
            className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setErrors(prev => ({ ...prev, username: null })); // Clear error on change
            }}
            className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setErrors(prev => ({ ...prev, role: null })); // Clear error on change
            }}
            className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
          >
            <option value="" disabled>Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: null })); // Clear error on change
            }}
            className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors(prev => ({ ...prev, password: null })); // Clear error on change
            }}
            className={`border rounded-md p-3 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md p-3 transition duration-200"
          >
            Sign Up
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