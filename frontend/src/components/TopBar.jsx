import React from 'react';

const TopBar = () => {
  return (
    <div className="h-16 bg-[#2F3136] text-white flex items-center justify-between px-4">
      <div className="flex items-center">
        <span className="mr-2">Workspace Title</span>
        <span className="text-gray-400">/ Breadcrumbs</span>
      </div>
      <div className="flex items-center">
        <input type="text" placeholder="Search..." className="bg-[#1E1F22] text-white px-2 py-1 rounded" />
        <div className="ml-4 w-8 h-8 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default TopBar; 