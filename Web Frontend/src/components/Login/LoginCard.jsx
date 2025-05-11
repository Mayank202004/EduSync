import React from 'react'

function LoginCard() {
  return (
    <div>
        <div className='w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-bold mb-4'>Login</h1>
            <form className='flex flex-col w-full px-8'>
            <input type="text" placeholder="Username" className='border border-gray-300 rounded-md p-2 mb-4' />
            <input type="password" placeholder="Password" className='border border-gray-300 rounded-md p-2 mb-4' />
            <button type="submit" className='bg-blue-500 text-white rounded-md p-2'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default LoginCard