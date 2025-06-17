import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import EditorCanvas from './EditorCanvas';

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <EditorCanvas />
      </div>
    </div>
  );
};

export default Layout; 