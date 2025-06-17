import React from 'react';
import { User } from 'lucide-react';

const PresenceIndicator = ({ users }) => {
  return (
    <div className="flex items-center space-x-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="relative"
          title={`${user.name} (${user.role})`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: user.color }}
          />
        </div>
      ))}
    </div>
  );
};

export default PresenceIndicator; 