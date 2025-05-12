import React from 'react';

const RightSidebar = () => {
  return (
    <div className="text-sm">
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Recent Achievements</h2>
        <p>Level 0</p>
        <p>150 Points are needed to move to the next level.</p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Upcoming Events</h2>
        <ul>
          <li>22 Mar - 2 Apr: Session Break</li>
          <li>29 Mar: Open House Std. I to IX</li>
          <li>30 Mar: Gudi Padwa</li>
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
