'use client';

import { Task } from '@/types/task';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2, Circle, Edit, Trash2, Calendar, MapPin, Tag,
  Moon, Briefcase, Users, Dumbbell, Heart, Book, ShoppingCart, DollarSign
} from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';

/**
 * TaskCard props interface
 */
interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// Category configurations with emojis
const categoryConfig = {
  namaz: { icon: Moon, emoji: '🕌', color: 'from-purple-500 to-indigo-600', name: 'Namaz' },
  work: { icon: Briefcase, emoji: '💼', color: 'from-blue-500 to-cyan-600', name: 'Work' },
  meeting: { icon: Users, emoji: '🤝', color: 'from-green-500 to-emerald-600', name: 'Meeting' },
  sports: { icon: Dumbbell, emoji: '⚽', color: 'from-orange-500 to-red-600', name: 'Sports' },
  personal: { icon: Heart, emoji: '💖', color: 'from-pink-500 to-rose-600', name: 'Personal' },
  study: { icon: Book, emoji: '📚', color: 'from-amber-500 to-yellow-600', name: 'Study' },
  shopping: { icon: ShoppingCart, emoji: '🛒', color: 'from-teal-500 to-cyan-600', name: 'Shopping' },
  finance: { icon: DollarSign, emoji: '💰', color: 'from-green-600 to-emerald-700', name: 'Finance' },
};

// Priority configurations
const priorityConfig = {
  low: { emoji: '📋', color: 'bg-gray-100 text-gray-700', name: 'Low' },
  medium: { emoji: '📌', color: 'bg-blue-100 text-blue-700', name: 'Medium' },
  high: { emoji: '⚡', color: 'bg-orange-100 text-orange-700', name: 'High' },
  urgent: { emoji: '🔥', color: 'bg-red-100 text-red-700', name: 'Urgent' },
};

/**
 * Luxury TaskCard component
 * Premium task card with category colors, emojis, and animations
 */
export function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const category = categoryConfig[task.category || 'personal'];
  const priority = priorityConfig[task.priority || 'medium'];

  return (
    <div
      className="group relative rounded-2xl border-2 border-amber-200/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 animate-in opacity-0 task-card-premium"
      style={{ animation: 'fade-in 0.4s ease-out forwards' }}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      {/* Category Badge with Gradient */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-bold shadow-md`}>
          <span className="text-lg">{category.emoji}</span>
          <span>{category.name}</span>
        </div>

        {/* Priority Badge */}
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${priority.color} text-sm font-bold`}>
          <span>{priority.emoji}</span>
          <span>{priority.name}</span>
        </div>
      </div>

      {/* Task Title */}
      <h3
        className={`mb-3 text-xl font-bold luxury-heading ${
          isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
        }`}
        title={task.title.length > 50 ? task.title : undefined}
      >
        {truncateText(task.title, 50)}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p
          className={`mb-4 text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-700'} line-clamp-2`}
          title={task.description.length > 100 ? task.description : undefined}
        >
          {truncateText(task.description, 100)}
        </p>
      )}

      {/* Task Metadata */}
      <div className="mb-4 space-y-2">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Location */}
        {task.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{task.location}</span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-amber-600" />
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-gray-800 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <Badge variant={isCompleted ? 'success' : 'warning'}>
          {isCompleted ? '✓ Completed' : '⏳ Pending'}
        </Badge>
        <span className="ml-2 text-xs text-gray-500">
          {formatDate(task.createdAt)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 border-t-2 border-amber-200/30 pt-4">
        {/* Completion Toggle */}
        <button
          onClick={() => onToggleStatus(task.id)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? (
            <>
              <Circle className="h-5 w-5" />
              <span>Reopen</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Complete</span>
            </>
          )}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(task)}
          className="flex items-center justify-center rounded-xl p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white transition-all hover:shadow-lg hover:scale-110 active:scale-95"
          aria-label={`Edit ${task.title}`}
        >
          <Edit className="h-5 w-5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center justify-center rounded-xl p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white transition-all hover:shadow-lg hover:scale-110 active:scale-95"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
