import React from 'react';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-[#1E1F22] text-white p-4">
      <h2 className="text-xl font-bold mb-4">Workspace</h2>
      <nav>
        <ul>
          <li className="mb-2">Pages</li>
          <li className="mb-2">Templates</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 