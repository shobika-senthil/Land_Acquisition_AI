import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Brain,
  MapPinned,
  Activity,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { AuthGeographicVisual } from '../../components/auth/AuthGeographicVisual';
import { Logo } from '../../components/ui/Logo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const destination =
    (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email, password, 'Administrator');
      navigate(destination, { replace: true });
    } catch {
      setErrorMessage('Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#2B1D14] flex flex-col">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="w-full border-b border-[#DCCCB8]/60 bg-[#FAF7F0]/90 backdrop-blur-md">

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-4 flex items-center justify-between">

          <Logo compact={false} />

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#654333] hover:text-[#2B1D14] px-4 py-2 rounded-xl hover:bg-[#EDE4D5] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to overview
          </Link>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">


          {/* =================================================
              LEFT — INTELLIGENCE PANEL
          ================================================= */}

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:col-span-6 relative overflow-hidden rounded-[2rem] min-h-[650px] bg-[#2D211A]"
          >

            {/* Geographic visual */}

            <div className="absolute inset-0 opacity-75">
              <AuthGeographicVisual />
            </div>

            {/* Dark overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#211711] via-[#2B1D14]/50 to-transparent" />

            {/* Content */}

            <div className="relative z-10 p-10 xl:p-12 flex flex-col justify-between w-full">

              {/* Top label */}

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">

                  <span className="w-1.5 h-1.5 rounded-full bg-[#D68A63] animate-pulse" />

                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#F5E7D3]">
                    Intelligence Network
                  </span>

                </div>

              </div>


              {/* Main content */}

              <div className="max-w-lg">

                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#D68A63] mb-4">
                  LAND ACQUISITION INTELLIGENCE
                </p>

                <h1 className="text-4xl xl:text-5xl font-display font-semibold leading-[1.08] text-[#FFF8ED]">
                  Turning land data into
                  <span className="text-[#D68A63]">
                    {' '}decisive action.
                  </span>
                </h1>

                <p className="mt-5 text-sm leading-7 text-[#E5D8C9] max-w-md">
                  Monitor acquisition progress, identify emerging risks,
                  forecast delays and make evidence-based infrastructure
                  decisions from one intelligence workspace.
                </p>


                {/* Intelligence indicators */}

                <div className="grid grid-cols-2 gap-3 mt-8">

                  <div className="rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md p-4">

                    <Brain className="w-5 h-5 text-[#D68A63] mb-3" />

                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#BFAF9E]">
                      Predictive AI
                    </p>

                    <p className="text-sm font-semibold text-[#FFF8ED] mt-1">
                      Delay forecasting
                    </p>

                  </div>


                  <div className="rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md p-4">

                    <MapPinned className="w-5 h-5 text-[#D68A63] mb-3" />

                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#BFAF9E]">
                      Spatial Intelligence
                    </p>

                    <p className="text-sm font-semibold text-[#FFF8ED] mt-1">
                      Parcel-level risk
                    </p>

                  </div>

                </div>

              </div>


              {/* Bottom status */}

              <div className="flex items-center justify-between gap-4 pt-8">

                <div className="flex items-center gap-2">

                  <ShieldCheck className="w-4 h-4 text-[#B8C29A]" />

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#CBBDAE]">
                    Secure administrative access
                  </span>

                </div>

                <div className="hidden xl:flex items-center gap-2">

                  <Activity className="w-3.5 h-3.5 text-[#D68A63]" />

                  <span className="text-[10px] font-mono text-[#BFAF9E]">
                    SYSTEM ONLINE
                  </span>

                </div>

              </div>

            </div>

          </motion.section>


          {/* =================================================
              RIGHT — LOGIN
          ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-6 flex items-center"
          >

            <div className="w-full max-w-xl mx-auto">

              {/* Mobile branding */}

              <div className="lg:hidden mb-7">

                <div className="flex items-center gap-2 text-[#B65A3C]">

                  <span className="w-1.5 h-1.5 rounded-full bg-[#B65A3C]" />

                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">
                    Land Acquisition Intelligence
                  </span>

                </div>

              </div>


              {/* Login card */}

              <div className="bg-[#FFFDF8] rounded-[2rem] border border-[#DCCCB8] shadow-[0_24px_70px_rgba(78,52,34,0.12)] overflow-hidden">

                {/* Card top accent */}

                <div className="h-1 bg-[#6A4330]" />


                <div className="p-7 sm:p-9 lg:p-11">


                  {/* Heading */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between gap-4">

                      <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#A9543A] bg-[#F9ECE7] border border-[#E5B9AA] px-3 py-1.5 rounded-full">

                        <span className="w-1.5 h-1.5 rounded-full bg-[#B65A3C]" />

                        Secure sign in

                      </span>


                      <span className="hidden sm:block text-[10px] font-mono text-[#8D7968]">
                        ADMIN PORTAL
                      </span>

                    </div>


                    <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#2B1D14] mt-5 tracking-tight">
                      Welcome back.
                    </h2>


                    <p className="text-sm text-[#705C4D] mt-2 leading-6">
                      Sign in to continue to your LANDLYTICS intelligence workspace.
                    </p>

                  </div>


                  {/* Error */}

                  {errorMessage && (

                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3.5 rounded-xl bg-[#FAECEC] border border-[#F1C1C1] text-xs font-medium text-[#A94A3F]"
                    >
                      {errorMessage}
                    </motion.div>

                  )}


                  {/* Form */}

                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >


                    {/* EMAIL */}

                    <div>

                      <label className="text-xs font-bold text-[#5A3424] block mb-2">
                        Email address
                      </label>


                      <div className="relative group">

                        <Mail className="w-4 h-4 text-[#9A806D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#B65A3C] transition-colors" />

                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="name@organization.gov.in"
                          className="w-full h-13 pl-11 pr-4 bg-[#F8F4EC] border border-[#D9C9B5] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#9A806D] focus:outline-none focus:ring-4 focus:ring-[#B65A3C]/10 focus:border-[#B65A3C] transition-all"
                        />

                      </div>

                    </div>


                    {/* PASSWORD */}

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <label className="text-xs font-bold text-[#5A3424]">
                          Password
                        </label>


                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              'Please contact your administrator to reset your password.'
                            )
                          }
                          className="text-[11px] font-semibold text-[#B65A3C] hover:text-[#8D402D] hover:underline underline-offset-2"
                        >
                          Forgot password?
                        </button>

                      </div>


                      <div className="relative group">

                        <Lock className="w-4 h-4 text-[#9A806D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#B65A3C] transition-colors" />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          required
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Enter your password"
                          className="w-full h-13 pl-11 pr-12 bg-[#F8F4EC] border border-[#D9C9B5] rounded-2xl text-sm font-medium text-[#2B1D14] placeholder-[#9A806D] focus:outline-none focus:ring-4 focus:ring-[#B65A3C]/10 focus:border-[#B65A3C] transition-all"
                        />


                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7563] hover:text-[#2B1D14] transition-colors"
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >

                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}

                        </button>

                      </div>

                    </div>


                    {/* REMEMBER ME */}

                    <div className="flex items-center justify-between pt-1">

                      <label className="flex items-center gap-2.5 text-xs font-medium text-[#6B5748] cursor-pointer">

                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-[#CDBBA5] accent-[#6A4330] focus:ring-[#B65A3C]"
                        />

                        Remember me on this device

                      </label>


                      <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#897667]">

                        <ShieldCheck className="w-3.5 h-3.5" />

                        Protected access

                      </div>

                    </div>


                    {/* SIGN IN */}

                    <div className="pt-2">

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full h-13 bg-[#5A3928] hover:bg-[#3B2418] text-[#FFF8ED] text-sm font-bold rounded-2xl shadow-[0_12px_25px_rgba(90,57,40,0.18)] hover:shadow-[0_16px_30px_rgba(90,57,40,0.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >

                        <span>
                          {isSubmitting
                            ? 'Signing in...'
                            : 'Continue to LANDLYTICS'}
                        </span>

                        {!isSubmitting && (
                          <ArrowRight className="w-4 h-4 text-[#D98A66] group-hover:translate-x-1 transition-transform" />
                        )}

                      </button>

                    </div>

                  </form>


                  {/* Trust indicators */}

                  <div className="mt-8 pt-6 border-t border-[#E2D6C5]">

                    <div className="grid grid-cols-3 gap-3">

                      <div className="text-center">

                        <Brain className="w-4 h-4 mx-auto text-[#A66A4D] mb-1.5" />

                        <p className="text-[9px] font-mono uppercase tracking-wider text-[#806A5A]">
                          AI insights
                        </p>

                      </div>


                      <div className="text-center">

                        <MapPinned className="w-4 h-4 mx-auto text-[#A66A4D] mb-1.5" />

                        <p className="text-[9px] font-mono uppercase tracking-wider text-[#806A5A]">
                          Spatial data
                        </p>

                      </div>


                      <div className="text-center">

                        <CheckCircle2 className="w-4 h-4 mx-auto text-[#A66A4D] mb-1.5" />

                        <p className="text-[9px] font-mono uppercase tracking-wider text-[#806A5A]">
                          Verified access
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Signup */}

                  <div className="mt-6 text-center text-xs text-[#5A3928]">

                    New to LANDLYTICS?{' '}

                    <Link
                      to="/signup"
                      className="font-bold text-[#B65A3C] hover:text-[#8D402D] hover:underline underline-offset-2"
                    >
                      Create account
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </motion.section>

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="w-full border-t border-[#DCCCB8]/60 bg-[#FAF7F0]">

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#897667]">

          <span>
            LANDLYTICS • Land Acquisition Intelligence Platform
          </span>

          <span>
            SECURE ADMINISTRATIVE ACCESS
          </span>

        </div>

      </footer>

    </div>
  );
};