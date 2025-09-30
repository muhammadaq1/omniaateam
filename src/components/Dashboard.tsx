import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  Activity,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Priority } from '@/types';

export const Dashboard: React.FC = () => {
  const { currentProject, currentUser, tasks } = useStore();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No Project Selected</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Select a project to view the dashboard.</p>
        </div>
      </div>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  const myTasks = tasks.filter(task => task.assigneeId === currentUser?.id);
  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.status !== 'done');
  const overdueTasks = tasks.filter(task => task.dueDate && task.dueDate < new Date() && task.status !== 'done');

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'My Tasks',
      value: myTasks.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Completed',
      value: doneTasks.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+18%',
      changeType: 'increase'
    },
    {
      name: 'In Progress',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-3%',
      changeType: 'decrease'
    }
  ];

  const recentTasks = tasks
    .filter(task => task.assigneeId === currentUser?.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/board" className="btn-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Board
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  from last week
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Overview */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Project Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tasks.length > 0 ? (doneTasks.length / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Urgent Tasks</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {urgentTasks.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Overdue Tasks</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {overdueTasks.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Team Members</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentProject.members?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
