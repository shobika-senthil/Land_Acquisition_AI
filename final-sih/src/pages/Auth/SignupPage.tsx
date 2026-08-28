import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, Building, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthGeographicVisual } from '../../components/auth/AuthGeographicVisual';
import { Logo } from '../../components/ui/Logo';
import { UserRole } from '../../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('Project Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !organization) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signup(name, email, role, organization);
      navigate('/dashboard', { replace: true });
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#2B1D14] font-sans flex flex-col justify-between">
      
      {/* 1. Minimal Auth Top Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Logo compact={false} />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A3424] hover:text-[#2B1D14] px-3.5 py-1.5 rounded-full hover:bg-[#EFE5D3] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to overview</span>
        </Link>
      </header>

      {/* 2. Main Split Authentication Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column (45%): Living Geographic Spatial Visual */}
          <div className="hidden lg:block lg:col-span-5 h-full">
            <AuthGeographicVisual />
          </div>

          {/* Right Column (55%): Clean Authentication Surface */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-xl bg-[#FFFCF7] rounded-3xl p-8 sm:p-12 border border-[#8C5A3C]/16 shadow-sandal"
            >
              {/* Header */}
              <div className="mb-6">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#B65A3C] bg-[#F9ECE7] px-3 py-1 rounded-full border border-[#E4B4A4]">
                  GET STARTED
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#2B1D14] mt-3 tracking-tight">
                  Create your LANDLYTICS account
                </h1>
                <p className="text-sm text-[#5A3424] mt-1.5 leading-relaxed font-normal">
                  Set up your workspace to explore land acquisition risk and geographic intelligence.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-[#FAECEC] border border-[#F3BEBF] text-xs font-medium text-[#A94A3F]">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8C5A3C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Dr. S. Vijayalakshmi"
                        className="w-full h-12 pl-11 pr-4 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#8C5A3C]/60 focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Work email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C5A3C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@organization.gov.in"
                        className="w-full h-12 pl-11 pr-4 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#8C5A3C]/60 focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Organization
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#8C5A3C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="State Highways / NHAI Cell"
                        className="w-full h-12 pl-11 pr-4 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#8C5A3C]/60 focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as UserRole)}
                      className="w-full h-12 px-4 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                    >
                      <option value="Project Officer">Project Officer</option>
                      <option value="State Officer">State Officer</option>
                      <option value="District Officer">District Officer</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8C5A3C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#8C5A3C]/60 focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C5A3C] hover:text-[#2B1D14] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5A3424] block mb-1.5">
                      Confirm password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 px-4 bg-[#F7F3EA] border border-[#D8C4A8] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#8C5A3C]/60 focus:outline-none focus:ring-2 focus:ring-[#B65A3C]/40 focus:border-[#B65A3C] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full h-12 bg-[#5A3424] hover:bg-[#43261A] text-[#F7F3EA] text-sm font-semibold rounded-2xl shadow-sandal hover:-translate-y-0.5 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Creating account...' : 'Create account'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D28B75] transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>

              {/* Footer Switcher */}
              <div className="mt-6 pt-5 border-t border-[#D8C4A8]/40 text-center text-xs text-[#5A3424]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#B65A3C] hover:underline">
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* 3. Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-[#8C5A3C] font-mono">
        LANDLYTICS • Land Acquisition Intelligence Platform
      </footer>

    </div>
  );
};
