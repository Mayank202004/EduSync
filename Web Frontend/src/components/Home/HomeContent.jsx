import React from 'react';
import { useAuth } from '@/auth/AuthContext';

const HomeContent = () => {
   const { user } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Hello Parent!</h1>
      <p>Checkout how {user.fullName} is progressing!</p>

      <div className="my-4 p-4 bg-white dark:bg-customDarkFg rounded shadow">
        <p>Select Date Range</p>
        <input type="date" className="mr-2" />
        <input type="date" />
        <p className="mt-2">0 Points Scored</p>
      </div>

      <div className="bg-white dark:bg-customDarkFg p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Tasks</h3>
        <ul>
          <li>English - 2 points - Pending</li>
          <li>English - 1 point - Pending</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeContent;
