import React from 'react'
import SubjectCard from './SubjectCard'

function ResourcesCard() {
  return (
    <div className='bg-white dark:bg-customDarkFg p-5 rounded-md'>
      <div className='flex items-center justify-between gap-5'>
        <div>
          <h1 className='text-2xl font-bold'>Resources</h1>
          <p className='text-gray-700 dark:text-gray-200'>Choose subject to see your study resources</p>
        </div>
        <div>
            <select
              id="options"
              name="options"
              class="block text-black rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-left"
            >
              <option value="term1">Term 1</option>
              <option value="term2">Term 2</option>
            </select>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-5 mt-5 p-3 bg-'>
        <SubjectCard subject='English' topics={18} bgColor='bg-blue-200' imgSrc='src/assets/English.png'/>
        <SubjectCard subject='Maths' topics={12} bgColor='bg-red-200' imgSrc='src/assets/Mathematics.png'/>
        <SubjectCard subject='Marathi' topics={10} bgColor='bg-emerald-100' imgSrc='src/assets/Marathi.png'/>
        <SubjectCard subject='Science' topics={14} imgSrc='src/assets/Science.png'/>
        <SubjectCard subject='History' topics={16} bgColor='bg-cyan-100' imgSrc='src/assets/History.png'/>
      </div>
    </div>
  )
}

export default ResourcesCard