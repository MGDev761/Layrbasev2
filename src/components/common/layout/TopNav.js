import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from '@headlessui/react';
import { 
  BellIcon, 
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
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
  const { user, userProfile, signOut, currentOrganization } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    setFeedbackText('');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (userProfile && userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (userProfile && userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email || 'User';
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
              <Popover.Button className="flex items-center p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
                </div>
              </Popover.Button>

              <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">{getUserInitials()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{getUserDisplayName()}</p>
                      <p className="text-purple-100 text-sm truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Current Organization */}
                {currentOrganization && (
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{currentOrganization.organization_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentOrganization.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => navigate('/myorgs')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BuildingOfficeIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <span>My Organizations</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Account Settings</span>
                  </button>

                  <button 
                    onClick={() => navigate('/help')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Help & Support</span>
                  </button>
                </div>

                {/* Sign Out */}
                <div className="border-t border-gray-200">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                  >
                    <div className="flex items-center">
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
                      <span>Sign Out</span>
                    </div>
                  </button>
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