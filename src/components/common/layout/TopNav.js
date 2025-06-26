import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from '@headlessui/react';
import { 
  BellIcon, 
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationModal from './NotificationModal';
import logo from '../../../assets/logopurple2.png';

const TopNav = ({ 
  notificationModalOpen,
  setNotificationModalOpen
}) => {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState('');
  const { user, userProfile, signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    setFeedbackText('');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button onClick={() => navigate('/dashboard')} className="flex items-center">
                <img src={logo} alt="LayrBase" className="h-6 w-auto" />
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            {/* Feedback Button */}
            <Popover className="relative">
              <Popover.Button className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium border border-gray-200 rounded-md">
                Feedback
              </Popover.Button>

              <Popover.Panel className="absolute right-0 z-10 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <select className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="" disabled selected>Select a topic...</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="improvement">Improvement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Your feedback..."
                        className="w-full h-32 rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </Popover.Panel>
            </Popover>

            {/* Notification Bell */}
            <button 
              onClick={() => setNotificationModalOpen(true)}
              className="relative p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <Popover className="relative">
              <Popover.Button className="p-1.5 rounded-full text-purple-800 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-pink-100 w-8 h-8 flex items-center justify-center text-xs font-medium">
                {userProfile && userProfile.first_name && userProfile.last_name 
                  ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`.toUpperCase()
                  : user?.email?.charAt(0).toUpperCase() || 'U'
                }
              </Popover.Button>

              <Popover.Panel className="absolute right-0 z-10 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2">
                  {/* Profile Circle */}
                  <div className="flex justify-center py-4">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-purple-800 text-lg font-medium">
                      {userProfile && userProfile.first_name && userProfile.last_name 
                        ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`.toUpperCase()
                        : user?.email?.charAt(0).toUpperCase() || 'U'
                      }
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="px-2 py-2 text-center">
                    <p className="font-semibold text-gray-800">
                      {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.email}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <div className="space-y-1 py-1">
                    <button className="block w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => navigate('/myorgs')}
                    >
                      My Organizations
                    </button>
                  </div>

                  <div className="border-t border-gray-200 my-1"></div>

                  <div className="space-y-1 py-1">
                    <button 
                      onClick={handleSignOut}
                      className="flex justify-between items-center w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Sign Out
                      <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={notificationModalOpen} 
        onClose={() => setNotificationModalOpen(false)} 
      />
    </nav>
  );
};

export default TopNav; 