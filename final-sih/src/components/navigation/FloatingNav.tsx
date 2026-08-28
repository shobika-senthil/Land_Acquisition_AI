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
  Shield, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Layers,
  ChevronDown,
  Building,
  BarChart3,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const FloatingNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchRole } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle Scroll behavior (transparent at top, shrink on down, show on up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 15);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menus on route change
  useEffect(() => {
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/', { replace: true });
    setTimeout(async () => {
      await logout();
      setIsLoggingOut(false);
    }, 350);
  };

  interface NavItem {
    label: string;
    path: string;
    icon?: any;
    badge?: string;
  }

  const primaryNavItems: NavItem[] = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Risk Map', path: '/gis-risk-map' },
    { label: 'Projects', path: '/projects' },
    { label: 'Insights', path: '/ai-insights' },
  ];

  const moreNavItems: NavItem[] = [
    { label: 'States', path: '/state-analysis', icon: Layers },
    { label: 'Districts', path: '/district-analysis', icon: Building },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: '5' },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  const roles: UserRole[] = [
    'Administrator',
    'Project Officer',
    'State Officer',
    'District Officer',
    'Analyst',
    'Viewer',
  ];

  const isMoreActive = moreNavItems.some(item => location.pathname === item.path);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Session Ending Splash during Logout */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#F7F2E8]/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#B65A3C] animate-ping" />
              <span className="text-sm font-mono font-bold text-[#5A3424] uppercase tracking-wider">
                Session Ending...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Capsule Header Container */}
      <header
        className={`fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[min(1180px,calc(100%-32px))] pointer-events-none ${
          scrollDirection === 'down' && scrolled ? '-translate-y-2 opacity-90 scale-[0.98]' : 'translate-y-0 opacity-100 scale-100'
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#FCFAF7]/92 backdrop-blur-xl shadow-floating border border-[#D8C4A8]/70'
              : 'bg-[#FCFAF7]/80 backdrop-blur-md shadow-sandal-sm border border-[#D8C4A8]/40'
          }`}
        >
          {/* 1. Left Logo */}
          <Logo compact={false} showSubtitle={!scrolled} />

          {/* 2. Center Navigation Links (Minimal & Clean) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {primaryNavItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EFE5D3] text-[#5A3424] font-bold border border-[#D8C4A8]/80 shadow-xs'
                      : 'text-[#5A3424]/80 hover:text-[#2B1D14] hover:bg-[#F7F2E8]/80'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* "More ▾" Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isMoreActive || moreDropdownOpen
                    ? 'bg-[#EFE5D3] text-[#5A3424] font-bold border border-[#D8C4A8]/80 shadow-xs'
                    : 'text-[#5A3424]/80 hover:text-[#2B1D14] hover:bg-[#F7F2E8]/80'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8C5A3C] transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-48 bg-[#FCFAF7] rounded-2xl shadow-sandal-xl border border-[#D8C4A8] p-1.5 z-50"
                  >
                    {moreNavItems.map(item => {
                      const Icon = item.icon;
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                            isItemActive
                              ? 'bg-[#EFE5D3] text-[#5A3424] font-bold'
                              : 'text-[#5A3424] hover:bg-[#F7F2E8]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#9B2226] text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Action / Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Active Alerts Bell Link */}
                <Link
                  to="/alerts"
                  className="relative p-2 rounded-full text-[#5A3424] hover:bg-[#EFE5D3] transition-colors"
                  title="Early Warning Radar Alerts"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9B2226] animate-pulse" />
                </Link>

                {/* User Avatar Capsule & Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#EFE5D3]/70 hover:bg-[#EFE5D3] border border-[#D8C4A8]/60 transition-all text-xs font-semibold text-[#5A3424]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#5A3424] text-[#F7F2E8] flex items-center justify-center text-[10px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-medium max-w-[110px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#8C5A3C]" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-[#FCFAF7] rounded-2xl shadow-sandal-xl border border-[#D8C4A8] p-2 z-50"
                      >
                        {/* User Summary */}
                        <div className="px-3 py-2.5 border-b border-[#D8C4A8]/40 mb-1">
                          <p className="text-xs font-bold text-[#2B1D14] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#8C5A3C] font-mono truncate">{user.email}</p>
                          <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#B65A3C] bg-[#F9ECE7] px-2 py-0.5 rounded-full border border-[#E4B4A4]">
                            <Shield className="w-3 h-3" />
                            <span>{user.role}</span>
                          </div>
                        </div>

                        {/* Persona Switcher */}
                        <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#8C5A3C] tracking-wider">
                          Switch Role View
                        </div>
                        <div className="grid grid-cols-2 gap-1 px-1 mb-2">
                          {roles.map(r => (
                            <button
                              key={r}
                              onClick={() => {
                                switchRole(r);
                                setUserDropdownOpen(false);
                              }}
                              className={`text-[11px] px-2 py-1 rounded-lg text-left transition-colors ${
                                user.role === r
                                  ? 'bg-[#5A3424] text-[#F7F2E8] font-bold'
                                  : 'text-[#5A3424] hover:bg-[#EFE5D3]'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-[#D8C4A8]/40 pt-1 space-y-0.5">
                          <Link
                            to="/settings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A3424] hover:bg-[#F7F2E8] rounded-xl font-medium"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>Profile & Preferences</span>
                          </Link>

                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-[#5A3424] hover:bg-[#F7F2E8] rounded-xl font-medium"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#8C5A3C]" />
                            <span>Admin Governance</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9B2226] hover:bg-[#FAECEC] rounded-xl font-bold transition-colors text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#5A3424] hover:text-[#2B1D14] px-3 py-1.5 rounded-full hover:bg-[#EFE5D3] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-bold bg-[#5A3424] hover:bg-[#43261A] text-[#F7F2E8] px-4 py-1.5 rounded-full shadow-sandal-sm transition-transform active:scale-95 flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#5A3424] hover:bg-[#EFE5D3] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Warm Cream Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#F7F2E8]/98 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 overflow-y-auto md:hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D8C4A8]/60">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B65A3C] font-bold">
                    DoLR Decision Support
                  </span>
                  <h3 className="text-xl font-display font-semibold text-[#2B1D14] mt-0.5">
                    LANDLYTICS Navigation
                  </h3>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-[#EFE5D3] text-[#5A3424]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="grid grid-cols-1 gap-2">
                {[...primaryNavItems, ...moreNavItems].map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-[#5A3424] text-[#F7F2E8] font-bold shadow-sandal'
                          : 'bg-[#FCFAF7] text-[#5A3424] border border-[#D8C4A8]/60 hover:bg-[#EFE5D3]'
                      }`}
                    >
                      <span className="font-semibold text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#9B2226] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer with User & Auth */}
            <div className="pt-6 border-t border-[#D8C4A8]/60">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#2B1D14]">{user.name}</p>
                    <p className="text-[11px] text-[#8C5A3C]">{user.role} • DoLR</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAECEC] text-[#9B2226] text-xs font-bold border border-[#F3BEBF]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-3 text-center bg-[#EFE5D3] text-[#5A3424] font-bold text-xs rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-3 text-center bg-[#5A3424] text-[#F7F2E8] font-bold text-xs rounded-xl shadow-sandal"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
