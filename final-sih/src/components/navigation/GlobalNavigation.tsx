import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Map as MapIcon, 
  Briefcase, 
  Sparkles, 
  Bell, 
  FileText, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Layers,
  ChevronDown,
  Building,
  BarChart3,
  Sliders,
  ArrowRight,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ALERTS_DATA } from '../../data/alerts';

export const GlobalNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchRole } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const activeAlertsCount = ALERTS_DATA.filter(a => !a.resolved && a.severity === 'CRITICAL').length;

  // Handle scroll detection for compact header transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(async () => {
      await logout();
      setIsLoggingOut(false);
      navigate('/', { replace: true });
    }, 400);
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: BarChart3 },
    { label: 'Risk Map', path: '/gis-risk-map', icon: Compass },
    { label: 'States', path: '/state-analysis', icon: MapIcon },
    { label: 'Districts', path: '/district-analysis', icon: Layers },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Insights', path: '/ai-insights', icon: Sparkles },
  ];

  const roles: UserRole[] = [
    'Administrator',
    'Project Officer',
    'State Officer',
    'District Officer',
    'Analyst',
  ];

  // Auth pages have their own minimal top navigation
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <>
      {/* Session Ending Splash */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[#F7F3EA]/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#B65A3C] animate-ping" />
              <span className="text-sm font-mono font-bold text-[#5A3424] uppercase tracking-wider">
                Ending Session...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Structured Horizontal Header (Sticky, Non-overlapping, Opaque) */}
      <header
        className={`sticky top-0 z-[1000] w-full bg-[#FFFCF7] border-b border-[#8C5A3C]/12 transition-all duration-300 ${
          scrolled ? 'shadow-sandal-sm py-2 sm:py-2.5' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Wordmark */}
          <div className="flex-shrink-0 flex items-center">
            <Logo compact={false} showSubtitle={!scrolled} />
          </div>

          {/* 2. Center: Desktop Navigation Links (Only shown when authenticated or on product routes) */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-1 bg-[#F7F3EA]/70 p-1.5 rounded-2xl border border-[#DCCCB8]/80">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/projects' && location.pathname.startsWith('/projects/')) ||
                  (item.path === '/state-analysis' && location.pathname.startsWith('/state-analysis')) ||
                  (item.path === '/states' && location.pathname.startsWith('/states')) ||
                  (item.path === '/district-analysis' && location.pathname.startsWith('/district-analysis')) ||
                  (item.path === '/districts' && location.pathname.startsWith('/districts'));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 z-10 ${
                      isActive
                        ? 'text-[#5A3928]'
                        : 'text-[#806A5A] hover:text-[#3B2418] hover:bg-[#E9DDC8]/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B85E3B]' : 'text-[#806A5A]'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-[#E9DDC8] rounded-xl -z-10 shadow-xs border border-[#DCCCB8]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#5A3928]">
              <a href="#intelligence" className="hover:text-[#B85E3B] transition-colors">Intelligence</a>
              <a href="#how-it-works" className="hover:text-[#B85E3B] transition-colors">How It Works</a>
              <a href="#signature-map" className="hover:text-[#B85E3B] transition-colors">Risk Map</a>
              <a href="#methodology" className="hover:text-[#B85E3B] transition-colors">Methodology</a>
              <a href="#8-phase-framework" className="hover:text-[#B85E3B] transition-colors">8-Phase Framework</a>
            </nav>
          )}

          {/* 3. Right: Actions & User Profile */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                {/* Alerts Quick Link */}
                <Link
                  to="/alerts"
                  className={`relative p-2 rounded-xl border transition-all ${
                    location.pathname === '/alerts'
                      ? 'bg-[#EFE5D3] text-[#5A3424] border-[#D8C4A8]'
                      : 'bg-[#FFFCF7] text-[#8C5A3C] border-[#D8C4A8]/60 hover:bg-[#F7F3EA] hover:text-[#2B1D14]'
                  }`}
                  title="Early Warning Radar Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {activeAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A9473B] text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                      {activeAlertsCount}
                    </span>
                  )}
                </Link>

                {/* Reports Quick Link */}
                <Link
                  to="/reports"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    location.pathname.startsWith('/reports')
                      ? 'bg-[#EFE5D3] text-[#5A3424] border-[#D8C4A8]'
                      : 'bg-[#FFFCF7] text-[#8C5A3C] border-[#D8C4A8]/60 hover:bg-[#F7F3EA] hover:text-[#2B1D14]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#B65A3C]" />
                  <span>Reports</span>
                </Link>

                {/* Profile Pill & Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-2xl bg-[#F7F3EA] hover:bg-[#EFE5D3] border border-[#D8C4A8] transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#5A3424] text-[#F7F3EA] flex items-center justify-center text-[10px] font-bold">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-semibold text-[#2B1D14] leading-none line-clamp-1 max-w-[100px]">
                        {user?.name ? user.name.split(' ')[0] : 'Officer'}
                      </span>
                      <span className="text-[9px] font-mono text-[#8C5A3C] leading-none mt-0.5">
                        {user?.role || 'Officer'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C5A3C]" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-64 bg-[#FFFCF7] rounded-3xl p-4 border border-[#D8C4A8] shadow-sandal-xl z-[1100]"
                      >
                        {/* User Header */}
                        <div className="pb-3 mb-3 border-b border-[#D8C4A8]/60">
                          <span className="text-[10px] font-mono font-bold text-[#B65A3C] uppercase block">
                            Signed in as
                          </span>
                          <p className="text-xs font-bold text-[#2B1D14] mt-0.5">{user?.name}</p>
                          <p className="text-[11px] text-[#8C5A3C] truncate">{user?.email}</p>
                        </div>

                        {/* Role Switcher */}
                        <div className="mb-3 pb-3 border-b border-[#D8C4A8]/60">
                          <span className="text-[10px] font-mono uppercase text-[#8C5A3C] font-semibold block mb-1.5">
                            Switch Officer Role
                          </span>
                          <div className="space-y-1">
                            {roles.map(r => (
                              <button
                                key={r}
                                onClick={() => {
                                  switchRole(r);
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                                  user?.role === r
                                    ? 'bg-[#EFE5D3] text-[#5A3424]'
                                    : 'text-[#8C5A3C] hover:bg-[#F7F3EA]'
                                }`}
                              >
                                <span>{r}</span>
                                {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-[#B65A3C]" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Secondary Links */}
                        <div className="space-y-1 mb-3 pb-3 border-b border-[#D8C4A8]/60">
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#5A3424] hover:bg-[#F7F3EA]"
                          >
                            <Shield className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>System Admin</span>
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#5A3424] hover:bg-[#F7F3EA]"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>Radar Settings</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#A9473B] hover:bg-[#FAECEC] transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-[#5A3424] hover:bg-[#EFE5D3] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5A3424] text-[#F7F3EA] text-xs font-semibold shadow-sandal hover:bg-[#43261A] transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D28B75]" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger (Hamburger Morphs to X) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#F7F3EA] text-[#5A3424] border border-[#D8C4A8] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* 4. Mobile Menu Full-Screen Sheet Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[64px] bottom-0 z-[990] bg-[#FFFCF7] border-t border-[#D8C4A8] p-6 overflow-y-auto lg:hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D8C4A8]/60">
                <span className="text-xs font-mono uppercase tracking-wider text-[#B65A3C] font-semibold">
                  LANDLYTICS Navigation
                </span>
                <span className="text-xs text-[#8C5A3C] font-mono">
                  {isAuthenticated ? (user?.role || 'Officer') : 'Guest'}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-[#EFE5D3] text-[#5A3424] border border-[#D8C4A8]'
                            : 'text-[#5A3424] hover:bg-[#F7F3EA]'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#B65A3C]" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <div className="pt-3 border-t border-[#D8C4A8]/60 space-y-1.5">
                    <Link
                      to="/alerts"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl text-sm font-semibold text-[#5A3424] hover:bg-[#F7F3EA]"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-[#B65A3C]" />
                        <span>Alerts Radar</span>
                      </div>
                      {activeAlertsCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#A9473B] text-white rounded-full text-xs font-mono">
                          {activeAlertsCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/reports"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold text-[#5A3424] hover:bg-[#F7F3EA]"
                    >
                      <FileText className="w-4 h-4 text-[#B65A3C]" />
                      <span>Reports & Dossiers</span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold text-[#5A3424] hover:bg-[#F7F3EA]"
                    >
                      <Shield className="w-4 h-4 text-[#8C5A3C]" />
                      <span>System Governance</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-center rounded-2xl bg-[#EFE5D3] text-[#5A3424] text-sm font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-center rounded-2xl bg-[#5A3424] text-[#F7F3EA] text-sm font-semibold"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="pt-6 border-t border-[#D8C4A8]/60">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FAECEC] text-[#A9473B] text-sm font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of LANDLYTICS</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
