import React from 'react'
import IsoCubeAnimation from '../components/Login/isoCubeAnimation'
import LoginCard from '../components/Login/loginCard'

function Login() {
  return (
    <>
        <div className='w-full h-screen flex items-start'>
          <IsoCubeAnimation/>
          <div className='w-full h-full flex items-center justify-center'>
            <LoginCard/>
          </div>
        </div>
    </>
    
  )
}

export default Login