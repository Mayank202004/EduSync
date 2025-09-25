import React, { useState } from 'react';
import IsoCubeAnimation from '../components/Login/isoCubeAnimation';
import LoginCard from '../components/Login/LoginCard';
import SignupCard from '@/components/Login/SignupCard';

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {/* Small Screen: Island layout over fullscreen animation */}
      <div className="md:hidden relative w-full h-dvh overflow-hidden">
        <IsoCubeAnimation autoplay={false} />

        {/* Absolute overlay with centered card */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="w-full max-w-sm pointer-events-auto">
            {isLogin ? (
              <LoginCard switchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupCard switchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>


      {/* Large Screen: Side-by-side layout */}
      <div className="hidden md:flex w-full min-h-screen bg-white">
        <div className="w-1/2 h-screen overflow-hidden relative">
          <IsoCubeAnimation />
        </div>

        <div className="w-1/2 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginCard switchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupCard switchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
