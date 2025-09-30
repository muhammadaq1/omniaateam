import React from 'react';
import { useStore } from '@/store/useStore';
import type { Status, Priority } from '@/types';
import { format } from 'date-fns';
import { Plus, MoreHorizontal, Calendar, Clock } from 'lucide-react';

export const BoardView: React.FC = () => {
  const { currentProject, tasks, users } = useStore();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No Board Available</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Select a project to view the board.</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'To Do',
      status: 'todo' as Status,
      color: '#6b7280',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      title: 'In Progress',
      status: 'in-progress' as Status,
      color: '#f59e0b',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      title: 'Review',
      status: 'review' as Status,
      color: '#8b5cf6',
      tasks: tasks.filter(task => task.status === 'review')
    },
    {
      title: 'Done',
      status: 'done' as Status,
      color: '#22c55e',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentProject.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kanban Board • {tasks.length} tasks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>
      
      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full space-x-6 p-6 min-w-max">
          {columns.map((column) => (
            <div key={column.status} className="flex flex-col h-full min-w-80">
              <div className="column-header">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{column.title}</h2>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3">
                {column.tasks.map((task) => {
                  const assignee = users.find(user => user.id === task.assigneeId);
                  const priorityColors = {
                    urgent: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
                    high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
                    medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                    low: 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                  };
                  
                  return (
                    <div key={task.id} className={`task-card border-l-4 ${priorityColors[task.priority]}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {task.title}
                        </h3>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                            </div>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            task.priority === 'urgent' ? 'text-red-600 bg-red-100' :
                            task.priority === 'high' ? 'text-orange-600 bg-orange-100' :
                            task.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-green-600 bg-green-100'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {assignee && (
                          <img 
                            src={assignee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face&auto=format'}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
