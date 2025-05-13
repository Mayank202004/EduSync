import React from 'react'

function SubjectCard({subject="Subject",topics=0}) {
  return (
    <div className='p-3 flex items-center justify-center bg-amber-300 rounded-md text-black min-w-50'>
        <div className='flex flex-col items-center justify-between gap-1'>
            <h3 className='text-xl font-bold'>{subject}</h3>
            <p>{topics} Topics</p>
        </div>
        <div className='w-20 h-20'>
            <img src="" alt="" />
        </div>
    </div>
  )
}

export default SubjectCard