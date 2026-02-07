'use client';

import { useEffect, useRef, useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Zap,
  Star,
  Calendar,
  Flame,
  Trophy,
  Heart,
  Book,
  Briefcase,
  Users,
  ShoppingCart,
  DollarSign,
  Dumbbell,
  Moon,
  type LucideIcon
} from 'lucide-react';
import { gsap } from 'gsap';
import type { TaskCategory } from '@/types/task';

/**
 * Luxury Premium Dashboard with comprehensive features
 * Includes: Categories, Animations, Marquee, Statistics
 */
export function DashboardLuxury() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
      </div>
    );
  }
  const statsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');

  // Category configurations with luxury theme
  const categories = [
    { id: 'namaz' as TaskCategory, name: 'Namaz', icon: Moon, color: 'from-purple-500 to-indigo-600', emoji: '🕌' },
    { id: 'work' as TaskCategory, name: 'Work', icon: Briefcase, color: 'from-blue-500 to-cyan-600', emoji: '💼' },
    { id: 'meeting' as TaskCategory, name: 'Meetings', icon: Users, color: 'from-green-500 to-emerald-600', emoji: '🤝' },
    { id: 'sports' as TaskCategory, name: 'Sports', icon: Dumbbell, color: 'from-orange-500 to-red-600', emoji: '⚽' },
    { id: 'personal' as TaskCategory, name: 'Personal', icon: Heart, color: 'from-pink-500 to-rose-600', emoji: '💖' },
    { id: 'study' as TaskCategory, name: 'Study', icon: Book, color: 'from-amber-500 to-yellow-600', emoji: '📚' },
    { id: 'health' as TaskCategory, name: 'Health', icon: Heart, color: 'from-red-500 to-pink-600', emoji: '❤️' },
    { id: 'shopping' as TaskCategory, name: 'Shopping', icon: ShoppingCart, color: 'from-teal-500 to-cyan-600', emoji: '🛒' },
    { id: 'finance' as TaskCategory, name: 'Finance', icon: DollarSign, color: 'from-green-600 to-emerald-700', emoji: '💰' },
    { id: 'family' as TaskCategory, name: 'Family', icon: Users, color: 'from-violet-500 to-purple-600', emoji: '👨‍👩‍👧‍👦' },
  ];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasksDueToday = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = new Date(t.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  }).length;

  // Priority breakdown
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const urgentTasks = tasks.filter(t => !t.completed && t.priority === 'urgent').length;

  // Category breakdown
  const tasksByCategory = categories.map(cat => ({
    ...cat,
    count: tasks.filter(t => t.category === cat.id).length,
    completed: tasks.filter(t => t.category === cat.id && t.completed).length,
  }));

  // Current streak (mock data - can be calculated from actual completion history)
  const currentStreak = 7;

  // GSAP Animations
  useEffect(() => {
    // Animate stat cards
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        }
      );
    }

    // Animate progress bars
    if (progressRef.current) {
      const progressBars = progressRef.current.querySelectorAll('.progress-bar');
      gsap.fromTo(
        progressBars,
        { width: 0 },
        {
          width: (i, target) => target.getAttribute('data-width') + '%',
          duration: 1.5,
          delay: 0.5,
          ease: 'power2.out',
        }
      );
    }

    // Floating animations
    gsap.to('.floating-icon', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    });

    // Sparkle animation
    gsap.to('.sparkle', {
      scale: 1.2,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Category cards animation
    gsap.from('.category-card', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'back.out(1.7)',
      delay: 0.8,
    });
  }, [tasks]);

  return (
    <div className="space-y-8 luxury-bg min-h-screen p-8 rounded-3xl">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute top-0 right-0 w-32 h-32 luxury-gradient opacity-20 rounded-full blur-3xl sparkle"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-600 floating-icon" />
            <h2 className="text-5xl font-bold luxury-heading">Premium Dashboard</h2>
          </div>
          <p className="text-xl text-gray-700 ml-11">Organize your life with excellence</p>
        </div>
      </div>

      {/* Marquee Feature Highlights */}
      <div className="relative overflow-hidden py-8 bg-gradient-to-r from-amber-50 via-purple-50 to-amber-50 rounded-3xl border-2 border-amber-200/30 shadow-xl">
        <div className="marquee-container">
          <div className="marquee-content">
            {[
              { icon: '🕌', text: 'Namaz Times' },
              { icon: '💼', text: 'Work Tasks' },
              { icon: '⚽', text: 'Sports Activities' },
              { icon: '🤝', text: 'Meetings' },
              { icon: '📚', text: 'Study Sessions' },
              { icon: '❤️', text: 'Health & Fitness' },
              { icon: '🛒', text: 'Shopping Lists' },
              { icon: '💰', text: 'Finance Tracking' },
              { icon: '👨‍👩‍👧‍👦', text: 'Family Time' },
              { icon: '💖', text: 'Personal Goals' },
            ].map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-3 px-8 py-4 mx-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-amber-100"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-lg font-bold luxury-heading whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          icon={<Target className="w-8 h-8" />}
          label="Total Tasks"
          value={totalTasks}
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
        />
        <PremiumStatCard
          icon={<CheckCircle2 className="w-8 h-8" />}
          label="Completed"
          value={completedTasks}
          gradient="from-green-500 to-emerald-600"
          bgGradient="from-green-50 to-emerald-100"
        />
        <PremiumStatCard
          icon={<Clock className="w-8 h-8" />}
          label="Pending"
          value={pendingTasks}
          gradient="from-amber-500 to-orange-600"
          bgGradient="from-amber-50 to-orange-100"
        />
        <PremiumStatCard
          icon={<Flame className="w-8 h-8" />}
          label="Current Streak"
          value={`${currentStreak} days`}
          gradient="from-red-500 to-orange-600"
          bgGradient="from-red-50 to-orange-100"
        />
      </div>

      {/* Category Overview */}
      <div className="dashboard-card rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold luxury-heading">Task Categories</h3>
            <p className="text-gray-600 mt-1">Organize by activity type</p>
          </div>
          <Trophy className="w-10 h-10 text-amber-500 floating-icon" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tasksByCategory.map((cat, index) => (
            <div
              key={cat.id}
              className="category-card task-card-premium dashboard-card rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{cat.emoji}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{cat.name}</h4>
                <div className="text-2xl font-bold luxury-text">{cat.count}</div>
                <div className="text-xs text-gray-600">
                  {cat.completed} completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress and Priority Section */}
      <div ref={progressRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="dashboard-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 luxury-gradient opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold luxury-heading">Completion Rate</h3>
                <p className="text-gray-600 mt-1">Your overall progress</p>
              </div>
              <div className="luxury-gradient p-4 rounded-2xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white floating-icon" />
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className="text-6xl font-bold luxury-text">{completionRate}%</span>
                </div>
                {completionRate >= 80 && (
                  <Award className="w-12 h-12 text-amber-500 floating-icon" />
                )}
              </div>
              <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                <div
                  data-width={completionRate}
                  className="progress-bar shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center luxury-gradient"
                ></div>
              </div>
              <p className="text-lg text-gray-700 mt-4 font-medium">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>

        {/* Priority Overview */}
        <div className="dashboard-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold luxury-heading">Priority Tasks</h3>
              <p className="text-gray-600 mt-1">High-priority items</p>
            </div>
            <Zap className="w-10 h-10 text-yellow-500 floating-icon" />
          </div>
          <div className="space-y-6">
            <PriorityItem
              label="Urgent Tasks"
              count={urgentTasks}
              color="from-red-600 to-red-700"
              icon="🔥"
            />
            <PriorityItem
              label="High Priority"
              count={highPriorityTasks}
              color="from-orange-500 to-red-600"
              icon="⚡"
            />
            <PriorityItem
              label="Due Today"
              count={tasksDueToday}
              color="from-purple-500 to-pink-600"
              icon="📅"
            />
          </div>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="dashboard-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 luxury-gradient opacity-5"></div>
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-4 sparkle" />
          <p className="text-3xl font-bold luxury-heading mb-3">
            "Success is the sum of small efforts repeated day in and day out"
          </p>
          <p className="text-gray-600 text-lg">Keep building your legacy! 🎯✨</p>

          {currentStreak >= 7 && (
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
              <Flame className="w-6 h-6 text-orange-600" />
              <span className="font-bold text-gray-800">
                {currentStreak} Day Streak! Amazing! 🔥
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Premium Stat Card Component
interface PremiumStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  gradient: string;
  bgGradient: string;
}

function PremiumStatCard({ icon, label, value, gradient, bgGradient }: PremiumStatCardProps) {
  return (
    <div className={`stat-card dashboard-card rounded-3xl p-6 shadow-xl bg-gradient-to-br ${bgGradient} border-2 border-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg floating-icon text-white`}>
          {icon}
        </div>
        <Star className="w-6 h-6 text-amber-500 sparkle" />
      </div>
      <div className="text-5xl font-bold luxury-heading mb-2">{value}</div>
      <div className="text-gray-700 font-semibold text-lg">{label}</div>
    </div>
  );
}

// Priority Item Component
interface PriorityItemProps {
  label: string;
  count: number;
  color: string;
  icon: string;
}

function PriorityItem({ label, count, color, icon }: PriorityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className="font-semibold text-gray-800">{label}</span>
      </div>
      <div className="text-3xl font-bold luxury-text">{count}</div>
    </div>
  );
}
