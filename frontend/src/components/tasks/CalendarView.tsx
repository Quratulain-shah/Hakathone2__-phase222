"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function CalendarView({ tasks = [], onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return tasks.filter((task) => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
      return taskDate === dateStr;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Safe task click handler
  const handleTaskClick = (task: Task) => {
    if (onTaskClick && typeof onTaskClick === "function") {
      onTaskClick(task);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-xl border border-amber-200/50 p-6 animate-fade-in backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <p className="text-sm text-gray-600">Track your tasks visually</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            
            size="sm"
            onClick={previousMonth}
            className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
          >
            Today
          </Button>

          <Button
            
            size="sm"
            onClick={nextMonth}
            className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
          <div className="text-sm text-gray-600">This Month</div>
          <div className="text-2xl font-bold text-gray-900">
            {
              tasks.filter((t) => {
                const taskDate = t.createdAt ? new Date(t.createdAt) : null;
                return (
                  taskDate &&
                  taskDate.getMonth() === month &&
                  taskDate.getFullYear() === year
                );
              }).length
            }
          </div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-emerald-600">
            {tasks.filter((t) => t.status === "completed").length}
          </div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-amber-600">
            {tasks.filter((t) => t.status === "pending").length}
          </div>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-amber-700 bg-amber-100/50 rounded-lg py-3"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayTasks = day ? getTasksForDate(day) : [];
          const completedTasks = dayTasks.filter(
            (t) => t.status === "completed"
          ).length;
          const pendingTasks = dayTasks.filter(
            (t) => t.status === "pending"
          ).length;

          return (
            <div
              key={index}
              className={`
                min-h-28 p-3 rounded-xl border-2 transition-all duration-300
                ${
                  day
                    ? "bg-white/80 hover:bg-white hover:shadow-lg cursor-pointer group"
                    : "bg-transparent border-transparent"
                }
                ${
                  isToday(day)
                    ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md"
                    : "border-amber-100 hover:border-amber-300"
                }
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div
                      className={`
                        text-base font-bold
                        ${
                          isToday(day)
                            ? "text-amber-700 bg-amber-100 px-2 py-1 rounded-lg"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {day}
                    </div>

                    {dayTasks.length > 0 && (
                      <div
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          completedTasks === dayTasks.length
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {dayTasks.length}
                      </div>
                    )}
                  </div>

                  {/* Task indicators */}
                  {dayTasks.length > 0 && (
                    <div className="space-y-2">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={`
                            text-xs px-2 py-1.5 rounded-lg truncate transition-all cursor-pointer
                            ${
                              task.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }
                            hover:scale-[1.02] hover:shadow-sm
                          `}
                          title={task.title}
                        >
                          <div className="flex items-center gap-1.5">
                            {task.status === "completed" ? (
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            ) : (
                              <Target className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{task.title}</span>
                          </div>
                        </div>
                      ))}

                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-lg">
                          +{dayTasks.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progress indicator */}
                  {dayTasks.length > 0 && completedTasks > 0 && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (completedTasks / dayTasks.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {completedTasks}/{dayTasks.length} done
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Summary */}
      <div className="mt-8 pt-6 border-t border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded border border-amber-300"></div>
              <span className="text-sm text-gray-700">Pending Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded border border-emerald-300"></div>
              <span className="text-sm text-gray-700">Completed Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded border-2 border-amber-500"></div>
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {monthNames[month]} {year}
          </div>
        </div>
      </div>
    </div>
  );
}
