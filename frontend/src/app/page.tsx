"use client";
import { Heart, Sparkles, Github, Twitter, Linkedin } from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/hooks/useAuth";
import {
  CheckCircle2,
  Calendar,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { gsap } from "gsap";

/**
 * Root page component - Premium animated landing page
 */
export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const circularTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Handle redirect for authenticated users
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && !redirecting) {
      setRedirecting(true);
      // Small delay to let homepage render first, then redirect
      const timer = setTimeout(() => {
        router.replace("/tasks");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, loading, redirecting]);

  // GSAP Animations
  useEffect(() => {
    // Only run animations if GSAP is available
    if (typeof window !== 'undefined' && typeof gsap !== 'undefined') {
      // Circular text animation - Large screen ke liye radius bada
      const circularTextContainer = circularTextRef.current;
      if (circularTextContainer) {
        const isLargeScreen = window.innerWidth >= 1280;
        const radius = isLargeScreen ? 180 : 150;
        const centerX = isLargeScreen ? 180 : 150;
        const centerY = isLargeScreen ? 180 : 150;

        const text = "TaskFlow • Organize Your Life • Achieve Your Goals • ";

        circularTextContainer.innerHTML = "";

        const spans: { span: HTMLSpanElement; angle: number }[] = [];
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const angle = (i / text.length) * 2 * Math.PI;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const span = document.createElement("span");
          span.textContent = char;
          span.style.position = "absolute";
          span.style.left = `${x}px`;
          span.style.top = `${y}px`;
          span.style.transformOrigin = `${centerX}px ${centerY}px`;
          circularTextContainer.appendChild(span);
          spans.push({ span, angle });
        }

        gsap.to(
          {},
          {
            duration: 20,
            repeat: -1,
            ease: "none",
            onUpdate: function () {
              const t = performance.now() / 7000;
              spans.forEach((item) => {
                const newAngle = (item.angle + t * 2 * Math.PI) % (2 * Math.PI);
                const x = centerX + radius * Math.cos(newAngle);
                const y = centerY + radius * Math.sin(newAngle);
                gsap.set(item.span, {
                  x: x - parseFloat(item.span.style.left),
                  y: y - parseFloat(item.span.style.top),
                  opacity: 0.7 + 0.3 * Math.sin(newAngle),
                });
              });
            },
          }
        );
      }

      // Hero image floating animation - Larger movement for large screens
      if (heroImageRef.current) {
        const movement = window.innerWidth >= 1280 ? 30 : 20;
        gsap.to(heroImageRef.current, {
          y: movement,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Animate feature cards
      const featureCards = document.querySelectorAll(".feature-card");
      if (featureCards.length > 0) {
        gsap.from(featureCards, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1,
        });
      }
    }
  }, []);

  // Show loading state initially
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="luxury-gradient w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700 font-medium">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen luxury-bg overflow-hidden">
      {/* Premium Header */}
      <header className="fixed w-full z-50 backdrop-blur-md bg-white/30 border-b border-amber-200/20">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 luxury-gradient rounded-2xl flex items-center justify-center shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300">
              <Target className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold luxury-text tracking-wider">
              TaskFlow
            </span>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/login")}
              className="text-sm sm:text-base hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 border-amber-200"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              className="luxury-gradient hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white border-0 text-sm sm:text-base"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Circular Animation */}
      <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-purple-100 rounded-full shadow-lg animate-fade-in">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-800 tracking-wide uppercase">
                Premium Productivity Suite
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold luxury-heading leading-tight animate-slide-up">
              Achieve
              <br />
              <span className="luxury-text">Excellence</span>
              <br />
              Daily
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-xl animate-fade-in-delay">
              Experience the art of productivity with our luxury task management
              platform. Elegant design meets powerful functionality to transform
              your workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 animate-fade-in-delay-2">
              <Button
                size="lg"
                onClick={() => router.push("/signup")}
                className="luxury-gradient hover:shadow-2xl hover:scale-110 transition-all duration-300 text-white text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 border-0"
              >
                Begin Your Journey{" "}
                <Star className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/login")}
                className="bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 border-2 border-amber-200"
              >
                Explore Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold luxury-text">
                  10K+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                  Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold luxury-text">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                  Uptime
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold luxury-text">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                  Support
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Circular Animation */}
          <div className="relative flex items-center justify-center mt-8 sm:mt-0">
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px]">
              {/* Circular Rotating Text */}
              <div
                ref={circularTextRef}
                className="circular-text-container absolute inset-0"
              />

              {/* Center Icon with Float Animation */}
              <div
                ref={heroImageRef}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 luxury-gradient rounded-3xl shadow-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-all duration-500">
                  <CheckCircle2 className="w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-60 xl:h-60 text-white" />
                </div>
              </div>

              {/* Decorative Orbits */}
              <div className="absolute inset-0 animate--slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-9 sm:h-9 luxury-gradient rounded-full shadow-lg"></div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <MarqueeSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Everything you need to stay organized
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Powerful features wrapped in a beautiful, intuitive interface
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <DetailedFeature
            icon={<Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />}
            title="Lightning Fast"
            description="Built with Next.js 14 for blazing fast performance and smooth animations"
            features={[
              "Instant load times",
              "Real-time updates",
              "Offline support",
            ]}
          />
          <DetailedFeature
            icon={
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            }
            title="Multiple Views"
            description="Switch between list, calendar, and kanban board views"
            features={["List view", "Calendar view", "Kanban board"]}
          />
          <DetailedFeature
            icon={
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
            }
            title="Productivity Insights"
            description="Track your progress with beautiful charts and statistics"
            features={["Completion rates", "Time tracking", "Goal progress"]}
          />
          <DetailedFeature
            icon={
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
            }
            title="Smart Organization"
            description="Filter, sort, and search your tasks effortlessly"
            features={["Smart filters", "Quick search", "Tags & categories"]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-amber-200/30 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold luxury-heading">TaskFlow</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your premium productivity companion. Organize life with elegance
                and achieve excellence daily.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold luxury-heading mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/tasks"
                    className="text-gray-700 hover:text-amber-700 transition-colors text-sm"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/tasks"
                    className="text-gray-700 hover:text-amber-700 transition-colors text-sm"
                  >
                    My Tasks
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-700 hover:text-amber-700 transition-colors text-sm"
                  >
                    Home
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-bold luxury-heading mb-4">Connect</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-amber-200/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                © currentYear TaskFlow. Built with
                <Heart className="w-4 h-4 text-red-500 inline animate-pulse" />
                and Next.js 14
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 font-semibold luxury-text">
                  Premium Edition
                </span>
                <span>v2.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Marquee Component
function MarqueeSection() {
  const features = [
    {
      icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      text: "Smart Task Management",
    },
    {
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
      text: "Calendar Integration",
    },
    {
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      text: "Analytics Dashboard",
    },
    { icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />, text: "Lightning Fast" },
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      text: "Premium Features",
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      text: "Productivity Boost",
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 sm:py-12 bg-gradient-to-r from-amber-50 via-purple-50 to-amber-50 border-y border-amber-200/30">
      <div className="marquee-container overflow-hidden">
        <div className="marquee-content flex whitespace-nowrap animate-marquee">
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 mx-2 sm:mx-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              <div className="luxury-gradient p-1 sm:p-2 rounded-lg sm:rounded-xl text-white">
                {feature.icon}
              </div>
              <span className="text-sm sm:text-lg font-semibold text-gray-800 whitespace-nowrap">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: any) {
  return (
    <div
      className="feature-card bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-amber-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 sm:mb-6 luxury-gradient p-3 sm:p-4 rounded-2xl inline-block">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 luxury-heading">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function DetailedFeature({ icon, title, description, features }: any) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        {description}
      </p>
      <ul className="space-y-1 sm:space-y-2">
        {features.map((feature: string, i: number) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm sm:text-base text-gray-700"
          >
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
