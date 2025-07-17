import React from 'react'
import IsoCubeAnimation from '../components/Login/isoCubeAnimation'
import LoginCard from '../components/Login/loginCard'
import SignupCard from '@/components/Login/SignupCard';
import { useState } from 'react';

function Login() {
  // Toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      {/* Animation only visible on md and up */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <IsoCubeAnimation />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8">
        {isLogin ? (
          <LoginCard switchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupCard switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}


export default Login