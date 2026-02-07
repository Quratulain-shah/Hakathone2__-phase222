'use client';

import { useEffect, useRef } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { CheckCircle2, Circle, Clock, TrendingUp, Calendar as CalendarIcon, Target, Sparkles, Award, Zap, Star } from 'lucide-react';
import { gsap } from 'gsap';

/**
 * Premium Animated Dashboard component with GSAP
 */
export function DashboardPremium() {
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
  const mediumPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'low').length;

  // GSAP Animations
  useEffect(() => {
    // Animate stat cards on mount
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
        },
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

    // Floating animation for icons
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
  }, [tasks]);

  return (
    <div className="space-y-8 luxury-bg min-h-screen p-8 rounded-3xl">
      {/* Premium Header with Animation */}
      <div className="relative">
        <div className="absolute top-0 right-0 w-32 h-32 luxury-gradient opacity-20 rounded-full blur-3xl sparkle"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-600 floating-icon" />
            <h2 className="text-5xl font-bold luxury-heading">Dashboard</h2>
          </div>
          <p className="text-xl text-gray-700 ml-11">Track your excellence and productivity</p>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <PremiumStatCard
          icon={<Target className="w-8 h-8" />}
          label="Total Tasks"
          value={totalTasks}
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
        />

        {/* Completed Tasks */}
        <PremiumStatCard
          icon={<CheckCircle2 className="w-8 h-8" />}
          label="Completed"
          value={completedTasks}
          gradient="from-green-500 to-emerald-600"
          bgGradient="from-green-50 to-emerald-100"
        />

        {/* Pending Tasks */}
        <PremiumStatCard
          icon={<Clock className="w-8 h-8" />}
          label="Pending"
          value={pendingTasks}
          gradient="from-amber-500 to-orange-600"
          bgGradient="from-amber-50 to-orange-100"
        />

        {/* Due Today */}
        <PremiumStatCard
          icon={<Zap className="w-8 h-8" />}
          label="Due Today"
          value={tasksDueToday}
          gradient="from-purple-500 to-pink-600"
          bgGradient="from-purple-50 to-pink-100"
        />
      </div>

      {/* Progress Section with Animations */}
      <div ref={progressRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="dashboard-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold luxury-heading">Completion Rate</h3>
              <p className="text-gray-600 mt-1">Your progress overview</p>
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

        {/* Priority Breakdown */}
        <div className="dashboard-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold luxury-heading">Priority Breakdown</h3>
              <p className="text-gray-600 mt-1">Task distribution</p>
            </div>
            <div className="luxury-gradient p-4 rounded-2xl shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white floating-icon" />
            </div>
          </div>
          <div className="space-y-5">
            <PremiumPriorityBar
              label="High Priority"
              count={highPriorityTasks}
              color="from-red-500 to-red-600"
              total={pendingTasks}
            />
            <PremiumPriorityBar
              label="Medium Priority"
              count={mediumPriorityTasks}
              color="from-yellow-500 to-amber-600"
              total={pendingTasks}
            />
            <PremiumPriorityBar
              label="Low Priority"
              count={lowPriorityTasks}
              color="from-green-500 to-emerald-600"
              total={pendingTasks}
            />
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="dashboard-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full luxury-gradient opacity-5"></div>
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-4 sparkle" />
          <p className="text-2xl font-bold luxury-heading mb-2">
            "Excellence is not a destination; it is a continuous journey."
          </p>
          <p className="text-gray-600">Keep up the great work! 🎯</p>
        </div>
      </div>
    </div>
  );
}

// Premium Stat Card Component
interface PremiumStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
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

// Premium Priority Bar Component
interface PremiumPriorityBarProps {
  label: string;
  count: number;
  color: string;
  total: number;
}

function PremiumPriorityBar({ label, count, color, total }: PremiumPriorityBarProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-800">{label}</span>
        <span className="font-bold luxury-text">{count}</span>
      </div>
      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
        <div
          data-width={percentage}
          className={`progress-bar shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${color}`}
        ></div>
      </div>
    </div>
  );
}
