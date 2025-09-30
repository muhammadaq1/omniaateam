import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  ChevronDown,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser, currentProject, projects } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Board', href: '/board', icon: KanbanSquare, current: location.pathname.startsWith('/board') },
    { name: 'Team', href: '/team', icon: Users, current: location.pathname === '/team' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar for mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:hidden`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-900">
          <SidebarContent navigation={navigation} currentProject={currentProject} setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <SidebarContent navigation={navigation} currentProject={currentProject} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="border-r border-gray-200 dark:border-gray-800 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
              {/* Search */}
              <div className="flex flex-1">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search tasks, projects..."
                    type="search"
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="ml-4 flex items-center space-x-4">
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* Notifications */}
                <button className="p-1 rounded-lg text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Bell className="h-5 w-5" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'}
                      alt={currentUser?.name || 'User'}
                    />
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: any[];
  currentProject: any;
  setSidebarOpen?: (open: boolean) => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, currentProject, setSidebarOpen }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Omniaa</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Task Manager</p>
          </div>
        </div>
      </div>

      {/* Project selector */}
      {currentProject && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentProject.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {currentProject.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentProject.members?.length} members
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${
                item.current
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-r-2 border-primary-700 dark:border-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200`}
            >
              <Icon
                className={`${
                  item.current
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                } mr-3 flex-shrink-0 h-5 w-5`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Quick actions */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>
    </>
  );
};
