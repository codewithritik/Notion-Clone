import React from 'react';
import { FileText, Settings, Search, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#2F3136]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#1E1F22] border-r border-[#3A3B3E]">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-[#0056F2] rounded"></div>
            <span className="font-medium text-white">My Workspace</span>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-2 py-1 rounded bg-[#2F3136] text-white flex items-center space-x-2">
              <FileText size={16} />
              <span>Quick Note</span>
            </button>
            <button className="w-full text-left px-2 py-1 rounded bg-[#2F3136] text-white flex items-center space-x-2">
              <Search size={16} />
              <span>All Pages</span>
            </button>
            <button className="w-full text-left px-2 py-1 rounded bg-[#2F3136] text-white flex items-center space-x-2">
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="h-14 bg-[#1E1F22] border-b border-[#3A3B3E] flex items-center px-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-white font-medium">Dashboard</h1>
            <ChevronDown size={16} className="text-[#A0A0A0]" />
          </div>
          <div className="ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pages..."
                className="bg-[#2F3136] text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#0056F2]"
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome to Notion</h1>
            <p className="text-[#A0A0A0]">Start writing your first page</p>
          </div>
          
          {/* Recent Pages */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1E1F22] border border-[#3A3B3E] rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-white">Getting Started</h3>
                <p className="text-sm text-[#A0A0A0]">Learn the basics of Notion</p>
              </div>
              <div className="p-4 bg-[#1E1F22] border border-[#3A3B3E] rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2 text-white">My First Page</h3>
                <p className="text-sm text-[#A0A0A0]">Start writing your content</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-[#0056F2] text-white rounded-lg hover:bg-[#0046D2] transition-colors">
                New Page
              </button>
              <button className="px-4 py-2 border border-[#3A3B3E] text-white rounded-lg hover:bg-[#2F3136] transition-colors">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 