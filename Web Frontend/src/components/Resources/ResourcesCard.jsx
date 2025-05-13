import React from 'react'
import SubjectCard from './SubjectCard'

function ResourcesCard() {
  return (
    <div className='bg-white dark:bg-customDarkFg p-5 rounded-md'>
      <div className='flex items-center justify-between gap-5'>
        <div>
          <h1 className='text-2xl font-bold'>Resources</h1>
          <p className='text-gray-700'>Choose subject to see your study resources</p>
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
      <div className='grid grid-cols-4 gap-5 mt-5 p-3'>
        <SubjectCard subject='English' topics={10}/>
        <SubjectCard subject='English' topics={10}/>
        <SubjectCard subject='English' topics={10}/>
        <SubjectCard subject='English' topics={10}/>
        <SubjectCard subject='English' topics={10}/>
      </div>
    </div>
  )
}

export default ResourcesCard