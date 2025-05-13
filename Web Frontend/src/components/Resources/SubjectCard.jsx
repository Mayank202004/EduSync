import React from 'react'

function SubjectCard({subject="Subject",topics=0,bgColor="bg-amber-300",imgSrc="src/assets/Subjects.png"}) {
  return (
    <div className={`p-3 flex items-center justify-center ${bgColor} rounded-md text-black min-w-50`}>
        <div className='flex flex-col items-center justify-between gap-1'>
            <h3 className='text-xl font-bold'>{subject}</h3>
            <p>{topics} Topics</p>
        </div>
        <div className=' ml-5 w-15 h-15'>
            <img src={imgSrc} alt="" draggable="false"/>
        </div>
    </div>
  )
}

export default SubjectCard