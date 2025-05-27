import React from 'react'
import IsoCubeAnimation from '../components/Login/isoCubeAnimation'
import LoginCard from '../components/Login/loginCard'
import SignupCard from '@/components/Login/SignupCard';
import { useState } from 'react';

function Login() {
  // State to toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='flex w-full h-full'>
      <IsoCubeAnimation />
      <div className='w-full h-full flex items-center ml-15'>
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