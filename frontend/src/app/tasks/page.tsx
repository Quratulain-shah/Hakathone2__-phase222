'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TaskList } from '@/components/tasks/TaskList';
import { CalendarView } from '@/components/tasks/CalendarView';
import { DashboardLuxury } from '@/components/tasks/DashboardLuxury';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/Button';
import { LayoutList, Calendar, BarChart3 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Task } from '@/types/task';

type ViewType = 'list' | 'calendar' | 'dashboard';

/**
 * Tasks page component with multiple views
 */
export default function TasksPage() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, loading } = useTasks();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const views = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'list' as ViewType, label: 'List', icon: <LayoutList className="w-4 h-4" /> },
    { id: 'calendar' as ViewType, label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col luxury-bg">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
          {/* View Switcher */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">My Workspace</h1>
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {views.map((view) => (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView(view.id)}
                  className={`
                    flex items-center gap-2 transition-all
                    ${currentView === view.id ? 'shadow-md scale-105' : 'hover:scale-105'}
                  `}
                >
                  {view.icon}
                  <span className="hidden sm:inline">{view.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* View Content */}
          <div className="animate-fade-in">
            {currentView === 'dashboard' && <DashboardLuxury />}
            {currentView === 'list' && <TaskList />}
            {currentView === 'calendar' && (
              <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Task Detail Modal */}
      {isModalOpen && selectedTask && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Task Details">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{selectedTask.title}</h3>
              {selectedTask.description && (
                <p className="text-gray-600 mt-2">{selectedTask.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${selectedTask.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'}
                `}
              >
                {selectedTask.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Created: {new Date(selectedTask.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
