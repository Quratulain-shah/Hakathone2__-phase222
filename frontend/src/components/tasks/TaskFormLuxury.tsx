"use client";

import { useState, useEffect, useRef } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { TaskCategory, TaskPriority, Task } from "@/types/task";
import {
  Sparkles,
  Target,
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  Moon,
  Briefcase,
  Users,
  Dumbbell,
  Heart,
  Book,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

interface TaskFormLuxuryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateTaskData {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
  location?: string;
  tags?: string[];
}

export function TaskFormLuxury({ isOpen, onClose }: TaskFormLuxuryProps) {
  // Provide default implementations if context is not available
  const tasksContext = useTasks?.();
  const toastContext = useToast?.();

  const createTask = tasksContext?.createTask || (() => Promise.resolve());
  const showToast =
    toastContext?.showToast ||
    ((message: string, type?: string) => {
      console.log(`${type || "info"}: ${message}`);
    });

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const formRef = useRef<HTMLDivElement>(null);

  // Category configurations
  const categories = [
    {
      id: "namaz" as TaskCategory,
      name: "Namaz",
      icon: Moon,
      emoji: "🕌",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "work" as TaskCategory,
      name: "Work",
      icon: Briefcase,
      emoji: "💼",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "meeting" as TaskCategory,
      name: "Meeting",
      icon: Users,
      emoji: "🤝",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "sports" as TaskCategory,
      name: "Sports",
      icon: Dumbbell,
      emoji: "⚽",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "personal" as TaskCategory,
      name: "Personal",
      icon: Heart,
      emoji: "💖",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "study" as TaskCategory,
      name: "Study",
      icon: Book,
      emoji: "📚",
      color: "from-amber-500 to-yellow-600",
    },
    {
      id: "shopping" as TaskCategory,
      name: "Shopping",
      icon: ShoppingCart,
      emoji: "🛒",
      color: "from-teal-500 to-cyan-600",
    },
    {
      id: "finance" as TaskCategory,
      name: "Finance",
      icon: DollarSign,
      emoji: "💰",
      color: "from-green-600 to-emerald-700",
    },
  ];

  // Priority configurations
  const priorities = [
    {
      id: "low" as TaskPriority,
      name: "Low",
      color: "from-gray-400 to-gray-500",
      emoji: "📋",
    },
    {
      id: "medium" as TaskPriority,
      name: "Medium",
      color: "from-blue-500 to-blue-600",
      emoji: "📌",
    },
    {
      id: "high" as TaskPriority,
      name: "High",
      color: "from-orange-500 to-orange-600",
      emoji: "⚡",
    },
    {
      id: "urgent" as TaskPriority,
      name: "Urgent",
      color: "from-red-500 to-red-600",
      emoji: "🔥",
    },
  ];

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const dueDateTime =
        dueDate && dueTime
          ? new Date(`${dueDate}T${dueTime}`).toISOString()
          : dueDate
          ? new Date(dueDate).toISOString()
          : undefined;

      const taskData: CreateTaskData = {
        title: title.trim(),
        category,
        priority,
      };

      // Add optional fields if they exist
      if (description.trim()) {
        taskData.description = description.trim();
      }
      if (dueDateTime) {
        taskData.dueDate = dueDateTime;
      }
      if (location.trim()) {
        taskData.location = location.trim();
      }
      if (tags.length > 0) {
        taskData.tags = tags;
      }

      await createTask(taskData);

      showToast("Task created successfully! 🎉", "success");
      handleClose();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create task",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("personal");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
    setLocation("");
    setTags([]);
    setTagInput("");
    setErrors({});
    onClose();
  };

  // Handle Enter key for tags
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" maxWidth="max-w-4xl">
      <div ref={formRef} className="space-y-6 p-6">
        {/* Luxury Header */}
        <div className="text-center pb-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Task</h2>
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-gray-600">
            Add a new task to your premium collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              <Target className="w-4 h-4 inline mr-2 text-amber-500" />
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="e.g., Morning Prayer, Team Meeting, Football Practice..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900 placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your task..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900 placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Category
            </label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  disabled={isSubmitting}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    category === cat.id
                      ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-lg transform scale-105`
                      : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:shadow-md"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-sm font-semibold">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-4 gap-3">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  disabled={isSubmitting}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    priority === p.id
                      ? `bg-gradient-to-br ${p.color} text-white border-transparent shadow-lg transform scale-105`
                      : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:shadow-md"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <div className="text-sm font-semibold">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-amber-500" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                <Clock className="w-4 h-4 inline mr-2 text-amber-500" />
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              <MapPin className="w-4 h-4 inline mr-2 text-amber-500" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mosque, Office, Stadium..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900 placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              <Tag className="w-4 h-4 inline mr-2 text-amber-500" />
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyPress}
                placeholder="Add tags and press Enter..."
                className="px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors text-gray-900 placeholder-gray-500 flex-1"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium flex items-center gap-2 border border-amber-200"
                  >
                    {tag}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => !isSubmitting && removeTag(tag)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
