import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Compass, 
  Activity, 
  Zap, 
  Layers, 
  ShieldCheck, 
  FileText,
  TrendingUp,
  Scale,
  Search,
  CheckCircle2,
  Building,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { ContourCanvas } from '../../components/storytelling/ContourCanvas';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { MarqueeTicker } from '../../components/ui/MarqueeTicker';
import { TiltCard } from '../../components/ui/TiltCard';
import { useAuth } from '../../context/AuthContext';
import { DISTRICTS_DATA } from '../../data/districts';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();

  // Scroll animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

  // Storytelling sequence step (0 to 5 for 01-06)
  const [activeStoryStep, setActiveStoryStep] = useState(0);

  // 8-Phase Framework active phase
  const [activePhaseIndex, setActivePhaseIndex] = useState(2);

  // Signature Map Experience State
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'Madurai Sector (NH-38 Corridor)',
    state: 'Tamil Nadu',
    district: 'Madurai',
    coords: [9.9252, 78.1198],
    risk: 82,
    overrun: '+8.5 Months',
    area: '1,284 Acres',
    population: '42,800',
    parcels: '183 plots',
    primaryDriver: 'Unmutated joint succession & circle rate disparity',
    recommendation: 'Execute Section 3H(4) court escrow deposit for disputed title shares to prevent stay order before Section 3D declaration.'
  });

  const [selectedRadius, setSelectedRadius] = useState(5);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Animated counter for prediction section
  const [animatedRisk, setAnimatedRisk] = useState(0);
  const [hasTriggeredCount, setHasTriggeredCount] = useState(false);

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  };

  const handleRiskMap = () => {
    if (isAuthenticated) {
      navigate('/risk-map');
    } else {
      navigate('/login', { state: { from: { pathname: '/risk-map' } } });
    }
  };

  useEffect(() => {
    const handleScrollForCounter = () => {
      const el = document.getElementById('prediction-section');
      if (el && !hasTriggeredCount) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          setHasTriggeredCount(true);
          let start = 0;
          const end = 82;
          const duration = 1400;
          const stepTime = Math.abs(Math.floor(duration / end));
          const timer = setInterval(() => {
            start += 1;
            setAnimatedRisk(start);
            if (start >= end) clearInterval(timer);
          }, stepTime);
        }
      }
    };

    window.addEventListener('scroll', handleScrollForCounter);
    return () => window.removeEventListener('scroll', handleScrollForCounter);
  }, [hasTriggeredCount]);

  // 6-Step Storytelling Journey (01 THE LAND to 06 THE OUTCOME)
  const storytellingJourney = [
    {
      num: '01',
      title: 'THE LAND',
      subtitle: 'Geographic & Spatial Baseline',
      desc: 'Pinpoints precise cadastral survey tracts along proposed alignment corridors across India with high-resolution satellite and revenue registry mapping.',
      metric: '500+ Corridors Mapped',
      badge: 'Spatial Foundation'
    },
    {
      num: '02',
      title: 'THE SIGNAL',
      subtitle: 'Early Anomaly Detection',
      desc: 'Monitors mutation discrepancies, unrecorded lineage successions, circle rate inflation, and pending sub-court notices before public gazette notifications.',
      metric: '18,400+ Records Screened',
      badge: 'Signal Intelligence'
    },
    {
      num: '03',
      title: 'THE RISK',
      subtitle: 'Multi-Factor Friction Synthesis',
      desc: 'Cross-evaluates title clarity, population density, compensation variance, environmental buffer overlaps, and historical friction patterns into a unified risk matrix.',
      metric: '8 Risk Dimensions Evaluated',
      badge: 'Friction Taxonomy'
    },
    {
      num: '04',
      title: 'THE PREDICTION',
      subtitle: 'Calibrated Delay Probability Score',
      desc: 'Calculates the probabilistic delay index and quantifies financial deadweight holding cost exposure before right-of-way bottlenecks materialize.',
      metric: '82/100 Predicted Risk',
      badge: 'Predictive Forewarning'
    },
    {
      num: '05',
      title: 'THE DECISION',
      subtitle: 'Statutory Administrative Directives',
      desc: 'Generates legally compliant mitigation workflows: Section 3H(4) Principal Civil Court escrow deposits, Special Lok Adalats, and biometric re-surveys.',
      metric: 'Defensible Action Protocols',
      badge: 'Decision Support'
    },
    {
      num: '06',
      title: 'THE OUTCOME',
      subtitle: 'Early Intervention Before Delay',
      desc: 'Pre-empts judicial injunctions, protects critical milestone timelines, and saves months of avoidable infrastructure capital drag.',
      metric: '140+ Working Days Saved',
      badge: 'Impact Verification'
    }
  ];

  // 8-Phase Land Acquisition Framework
  const acquisitionPhases = [
    {
      id: 1,
      name: '01. Location & Alignment',
      statute: 'Preliminary Alignment Feasibility',
      riskScore: 18,
      riskLevel: 'LOW' as const,
      riskDriver: 'Topographic slope & reserve forest buffer',
      mitigation: 'Adjust RoW polygon to avoid sensitive eco-zones.'
    },
    {
      id: 2,
      name: '02. Land Identification',
      statute: 'Section 3A / RFCTLARR Section 4(1)',
      riskScore: 34,
      riskLevel: 'LOW' as const,
      riskDriver: 'Overlapping survey numbers in taluk maps',
      mitigation: 'Execute DGPS ground-truthing with drone survey mesh.'
    },
    {
      id: 3,
      name: '03. Ownership Verification',
      statute: 'Record of Rights (RoR) Mutation',
      riskScore: 68,
      riskLevel: 'HIGH' as const,
      riskDriver: 'Unpartitioned ancestral shares with missing heirs',
      mitigation: 'Convene Special Gram Sabha mutation certification camp.'
    },
    {
      id: 4,
      name: '04. Documentation Completeness',
      statute: 'Bhoomi & 7/12 Revenue Registers',
      riskScore: 54,
      riskLevel: 'MODERATE' as const,
      riskDriver: 'Mismatch between registered deed and encumbrance certificate',
      mitigation: 'Issue pre-notice reconciliation directive to Tahsildar.'
    },
    {
      id: 5,
      name: '05. Valuation & Market Value',
      statute: 'First Schedule / Circle Rate Disparity',
      riskScore: 76,
      riskLevel: 'HIGH' as const,
      riskDriver: 'Circle rate 2.4x below prevailing private transaction rates',
      mitigation: 'Apply Section 26(1) weighted average registered transaction formula.'
    },
    {
      id: 6,
      name: '06. Legal Status & Litigation',
      statute: 'Section 3C Objections / Civil Suits',
      riskScore: 88,
      riskLevel: 'CRITICAL' as const,
      riskDriver: 'Title partition suits with interim stay petitions',
      mitigation: 'Apply Section 3H(4) judicial court deposit protocol.'
    },
    {
      id: 7,
      name: '07. Compensation & R&R',
      statute: 'Second Schedule Rehabilitation Package',
      riskScore: 62,
      riskLevel: 'MODERATE' as const,
      riskDriver: 'Non-titleholder dwelling relocation consensus',
      mitigation: 'Structure annuity & housing site entitlement allocation.'
    },
    {
      id: 8,
      name: '08. Possession & Right-of-Way',
      statute: 'Section 3E / Section 38 Vesting',
      riskScore: 42,
      riskLevel: 'MODERATE' as const,
      riskDriver: 'Standing crop harvesting & demolition timeline',
      mitigation: 'Execute staged handover milestones with joint inspection.'
    }
  ];

  // Signature Map Location Presets
  const locationPresets = [
    {
      name: 'Madurai Sector (NH-38 Corridor)',
      state: 'Tamil Nadu',
      district: 'Madurai',
      coords: [9.9252, 78.1198],
      risk: 82,
      overrun: '+8.5 Months',
      area: '1,284 Acres',
      population: '42,800',
      parcels: '183 plots',
      primaryDriver: 'Unmutated joint succession & circle rate disparity',
      recommendation: 'Execute Section 3H(4) court escrow deposit for disputed title shares.'
    },
    {
      name: 'Pune Ring Road Alignment',
      state: 'Maharashtra',
      district: 'Pune',
      coords: [18.5204, 73.8567],
      risk: 79,
      overrun: '+7.2 Months',
      area: '2,150 Acres',
      population: '86,400',
      parcels: '312 plots',
      primaryDriver: 'High urban peri-fringe market valuation claims',
      recommendation: 'Deploy consent-based structured compensation multiplier (Section 26).'
    },
    {
      name: 'Varanasi-Kolkata Expressway Package 4',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      coords: [25.3176, 82.9739],
      risk: 86,
      overrun: '+9.4 Months',
      area: '1,640 Acres',
      population: '64,200',
      parcels: '245 plots',
      primaryDriver: 'Religious land trust & co-tenancy title conflicts',
      recommendation: 'Empanel Special Lok Adalat bench for pre-notification settlement.'
    },
    {
      name: 'Chennai Outer Bypass Corridor',
      state: 'Tamil Nadu',
      district: 'Kanchipuram',
      coords: [12.8342, 79.7036],
      risk: 74,
      overrun: '+6.1 Months',
      area: '980 Acres',
      population: '38,100',
      parcels: '156 plots',
      primaryDriver: 'Wetland classification and agricultural conversion restrictions',
      recommendation: 'Obtain expedited state revenue environment NOC with digital boundary alignment.'
    },
    {
      name: 'Dholera Industrial Rail Link',
      state: 'Gujarat',
      district: 'Ahmedabad',
      coords: [22.2500, 72.1900],
      risk: 36,
      overrun: '+1.5 Months',
      area: '3,400 Acres',
      population: '12,500',
      parcels: '88 plots',
      primaryDriver: 'Contiguous government-held saline wasteland tract',
      recommendation: 'Execute standard revenue vesting clearance under Section 3D.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F7F3EA] text-[#3B2418] overflow-x-hidden font-sans">
      <DemoBanner />

      {/* 1. HERO SECTION: Apple-inspired typography & animated geographic visual */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-16">
        <ContourCanvas className="opacity-75" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#DCCCB8_1px,transparent_1px),linear-gradient(to_bottom,#DCCCB8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center pt-8 sm:pt-12"
        >
          {/* Organization Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCFAF5] border border-[#DCCCB8] shadow-sandal-sm mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85E3B] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#5A3928] tracking-tight">
              Land Acquisition Intelligence • Predictive Geospatial Decision Support
            </span>
          </motion.div>

          {/* Main Headline (Apple-inspired SF Pro Display) */}
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-hero font-display font-semibold text-[#3B2418] tracking-tight text-balance mb-6"
          >
            See the risk <br />
            <span className="text-[#B85E3B]">before the delay.</span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5A3928] max-w-2xl text-balance leading-relaxed mb-10 font-normal"
          >
            LANDLYTICS transforms land acquisition records, geographic context and predictive analytics into early intelligence for better decisions.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <MagneticButton
              size="lg"
              variant="primary"
              onClick={handleExplore}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto cursor-pointer"
            >
              Explore LANDLYTICS →
            </MagneticButton>

            <MagneticButton
              size="lg"
              variant="outline"
              onClick={handleRiskMap}
              icon={<Compass className="w-4 h-4 text-[#B85E3B]" />}
              className="w-full sm:w-auto cursor-pointer"
            >
              Explore Risk Map
            </MagneticButton>
          </motion.div>

          {/* Subtle Live Coordinates Telemetry */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#5A3928] bg-[#FCFAF5]/90 px-4 py-2 rounded-full border border-[#DCCCB8] shadow-sandal-sm"
          >
            <span className="flex items-center gap-1.5 text-[#B85E3B] font-semibold">
              <Activity className="w-3.5 h-3.5 animate-spin-slow" />
              RADAR ACTIVE
            </span>
            <span>•</span>
            <span>MADURAI CORRIDOR (9.9252° N, 78.1198° E)</span>
            <span>•</span>
            <span className="text-[#B54036] font-semibold">82/100 PREDICTED RISK</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* 2. CORE INTELLIGENCE: Why Land Acquisition Delays Happen */}
      <section id="intelligence" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#E9DDC8]/40 border-b border-[#DCCCB8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B85E3B] bg-[#FCFAF5] px-3.5 py-1 rounded-full border border-[#DCCCB8]">
              The Core Problem
            </span>
            <h2 className="text-section-heading font-display font-semibold text-[#3B2418] mt-4">
              Infrastructure moves fast. <br />
              <span className="text-[#5A3928]">Land acquisition doesn't always.</span>
            </h2>
            <p className="text-[#5A3928] text-base max-w-2xl mx-auto mt-3 leading-relaxed">
              Over 60% of major infrastructure projects in India encounter multi-month delays during the land acquisition phase, incurring massive capital holding deadweight.
            </p>
          </div>

          {/* 3 Impact Cards with 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border border-[#DCCCB8] shadow-sandal-sm hover:shadow-sandal transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#E9DDC8] text-[#B85E3B] flex items-center justify-center mb-4 text-xl">
                ⏱️
              </div>
              <h3 className="text-card-heading font-display font-semibold text-[#3B2418] mb-2">Project Timelines</h3>
              <p className="text-xs sm:text-sm text-[#5A3928] leading-relaxed">
                Average right-of-way (RoW) acquisition delays range from <strong>8 to 16 months</strong> across high-density economic corridors.
              </p>
            </TiltCard>

            <TiltCard className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border border-[#DCCCB8] shadow-sandal-sm hover:shadow-sandal transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#E9DDC8] text-[#3B2418] flex items-center justify-center mb-4 text-xl">
                💰
              </div>
              <h3 className="text-card-heading font-display font-semibold text-[#3B2418] mb-2">Cost Escalation</h3>
              <p className="text-xs sm:text-sm text-[#5A3928] leading-relaxed">
                Litigation, interest holding, and contractor idle claims add <strong>₹1,200+ Cr</strong> in annual deadweight loss across stalled alignment packages.
              </p>
            </TiltCard>

            <TiltCard className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border border-[#DCCCB8] shadow-sandal-sm hover:shadow-sandal transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#E9DDC8] text-[#65704C] flex items-center justify-center mb-4 text-xl">
                ⚖️
              </div>
              <h3 className="text-card-heading font-display font-semibold text-[#3B2418] mb-2">Title & Heritage Friction</h3>
              <p className="text-xs sm:text-sm text-[#5A3928] leading-relaxed">
                Ancestral joint-ownership, unmutated revenue registers, and circle rate disparities trigger severe judicial injunctions.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. SCROLL-DRIVEN STORYTELLING: 01 THE LAND to 06 THE OUTCOME */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F3EA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#806A5A]">
              Storytelling Sequence
            </span>
            <h2 className="text-section-heading font-display font-semibold text-[#3B2418] mt-2">
              From Location → Signal → Risk → Action
            </h2>
            <p className="text-[#5A3928] text-base mt-2">
              How LANDLYTICS guides decision-makers from raw cadastral geography to statutory resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: 6-Stage Interactive Navigation Cards */}
            <div className="lg:col-span-5 space-y-3">
              {storytellingJourney.map((step, idx) => (
                <div
                  key={step.num}
                  onClick={() => setActiveStoryStep(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    activeStoryStep === idx
                      ? 'bg-[#3B2418] text-[#F7F3EA] border-[#3B2418] shadow-sandal-lg ring-2 ring-[#B85E3B]/40'
                      : 'bg-[#FCFAF5] text-[#3B2418] border-[#DCCCB8] hover:bg-[#E9DDC8]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-mono text-xs font-bold ${
                      activeStoryStep === idx ? 'text-[#C87552]' : 'text-[#806A5A]'
                    }`}>
                      {step.num}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      activeStoryStep === idx ? 'text-[#E9DDC8]' : 'text-[#806A5A]'
                    }`}>
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-display font-semibold mb-0.5">
                    {step.title} — <span className="font-normal text-xs opacity-90">{step.subtitle}</span>
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${
                    activeStoryStep === idx ? 'text-[#E9DDC8]' : 'text-[#5A3928]'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Side: Live Dynamic Simulation Canvas */}
            <div className="lg:col-span-7 sticky top-24">
              <div className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#DCCCB8] shadow-sandal-lg">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#DCCCB8] mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#B85E3B] tracking-wider block">
                      STAGE {storytellingJourney[activeStoryStep].num} • {storytellingJourney[activeStoryStep].badge}
                    </span>
                    <h4 className="text-card-heading font-display font-semibold text-[#3B2418] mt-0.5">
                      {storytellingJourney[activeStoryStep].title}: {storytellingJourney[activeStoryStep].subtitle}
                    </h4>
                  </div>
                  <RiskBadge level={activeStoryStep >= 3 ? 'CRITICAL' : 'MODERATE'} />
                </div>

                {/* Body Explanation */}
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#5A3928] leading-relaxed">
                    {storytellingJourney[activeStoryStep].desc}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#E9DDC8]/60 border border-[#DCCCB8] grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#806A5A] block">Benchmark</span>
                      <span className="font-semibold text-[#3B2418]">{storytellingJourney[activeStoryStep].metric}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#806A5A] block">Target Zone</span>
                      <span className="font-semibold text-[#3B2418]">Madurai South (NH-38 Align.)</span>
                    </div>
                  </div>

                  {activeStoryStep >= 4 && (
                    <div className="p-3.5 rounded-2xl bg-[#3B2418] text-[#F7F3EA] border border-[#5A3928] text-xs">
                      <span className="text-[#C87552] font-semibold block mb-1">⚡ Recommended Administrative Action:</span>
                      <span>Execute Section 3H(4) court escrow deposit to prevent judicial injunction. Estimated timeline saved: 140+ days.</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCCCB8] flex items-center justify-between">
                  <button
                    onClick={() => setActiveStoryStep((activeStoryStep + 1) % storytellingJourney.length)}
                    className="text-xs font-semibold text-[#B85E3B] hover:text-[#3B2418] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Stage: {storytellingJourney[(activeStoryStep + 1) % storytellingJourney.length].title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleRiskMap}
                    className="px-4 py-2 bg-[#3B2418] text-[#F7F3EA] rounded-full text-xs font-semibold hover:bg-[#5A3928] cursor-pointer"
                  >
                    Inspect on Live Map
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SIGNATURE INTERACTIVE EXPERIENCE: Choose a place. Understand its risk. */}
      <section id="signature-map" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#E9DDC8]/30 border-y border-[#DCCCB8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B85E3B] bg-[#FCFAF5] px-3.5 py-1 rounded-full border border-[#DCCCB8]">
              Signature Experience
            </span>
            <h2 className="text-section-heading font-display font-semibold text-[#3B2418] mt-3">
              Choose a place. <br />
              <span className="text-[#5A3928]">Understand its risk.</span>
            </h2>
            <p className="text-[#5A3928] text-base mt-2">
              Select any infrastructure corridor location, choose your analysis radius, and evaluate geospatial risk factors instantly.
            </p>
          </div>

          {/* Interactive Control Strip */}
          <div className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#DCCCB8] shadow-sandal space-y-6">
            
            {/* Presets & Search */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#DCCCB8]">
              <div>
                <span className="text-xs font-bold text-[#806A5A] uppercase tracking-wider block mb-2">
                  Select Corridor Alignment:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {locationPresets.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedLocation.name === loc.name
                          ? 'bg-[#3B2418] text-[#F7F3EA] shadow-xs'
                          : 'bg-[#F7F3EA] text-[#5A3928] border border-[#DCCCB8] hover:bg-[#E9DDC8]'
                      }`}
                    >
                      📍 {loc.district} ({loc.risk} Risk)
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius Selector */}
              <div>
                <span className="text-xs font-bold text-[#806A5A] uppercase tracking-wider block mb-2">
                  Select Radius Buffer:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 5, 10, 25, 50].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRadius(r)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        selectedRadius === r
                          ? 'bg-[#B85E3B] text-[#FFFFFF] shadow-xs'
                          : 'bg-[#F7F3EA] text-[#5A3928] border border-[#DCCCB8] hover:bg-[#E9DDC8]'
                      }`}
                    >
                      {r} KM
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Score Card */}
              <div className="lg:col-span-5 bg-[#F7F3EA] rounded-2xl p-6 border border-[#DCCCB8] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#806A5A]">
                      OVERALL ACQUISITION RISK
                    </span>
                    <RiskBadge level={selectedLocation.risk >= 80 ? 'CRITICAL' : 'HIGH'} />
                  </div>

                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-5xl sm:text-6xl font-display font-bold text-[#B54036]">
                      {selectedLocation.risk}
                    </span>
                    <span className="text-lg font-semibold text-[#806A5A]">/ 100</span>
                  </div>

                  <p className="text-xs font-semibold text-[#3B2418]">
                    {selectedLocation.name}
                  </p>
                  <p className="text-[11px] text-[#806A5A] font-mono mt-0.5">
                    {selectedLocation.coords[0]}° N, {selectedLocation.coords[1]}° E • {selectedRadius} KM Buffer
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#DCCCB8] text-xs">
                    <div>
                      <span className="text-[10px] text-[#806A5A] uppercase block">Land Area</span>
                      <span className="font-bold text-[#3B2418]">{selectedLocation.area}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#806A5A] uppercase block">Population</span>
                      <span className="font-bold text-[#3B2418]">{selectedLocation.population}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#806A5A] uppercase block">Overrun</span>
                      <span className="font-bold text-[#B54036]">{selectedLocation.overrun}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCCCB8]">
                  <button
                    onClick={handleRiskMap}
                    className="w-full py-2.5 bg-[#3B2418] text-[#F7F3EA] text-xs font-semibold rounded-xl hover:bg-[#5A3928] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Full GIS Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Factor Deconstruction */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-sm font-display font-semibold text-[#3B2418]">
                  Why is this area at risk?
                </h4>

                <div className="space-y-3">
                  {[
                    { label: 'Ownership Complexity & Unmutated Lineage', pct: 82, pts: '+24 pts' },
                    { label: 'Legal Disputes & Sub-Court Injunctions', pct: 71, pts: '+18 pts' },
                    { label: 'Compensation Variance (>1.8x Market Rate)', pct: 62, pts: '+14 pts' },
                    { label: 'Documentation Gaps in Bhoomi/RoR', pct: 45, pts: '+10 pts' },
                    { label: 'Infrastructure & Railway Proximity', pct: 38, pts: '+6 pts' }
                  ].map((f, idx) => (
                    <div key={idx} className="bg-[#FCFAF5] p-3 rounded-xl border border-[#DCCCB8]">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#3B2418] mb-1">
                        <span>{f.label}</span>
                        <span className="font-mono text-[#B85E3B] text-[11px]">{f.pts}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E9DDC8] overflow-hidden">
                        <div className="h-full bg-[#B85E3B] rounded-full" style={{ width: `${f.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FCFAF5] border border-[#DCCCB8] text-xs">
                  <span className="font-bold text-[#3B2418] block mb-0.5">What should happen next?</span>
                  <p className="text-[#5A3928] text-[11px] leading-relaxed">
                    {selectedLocation.recommendation}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. 8-PHASE LAND ACQUISITION FRAMEWORK */}
      <section id="8-phase-framework" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F3EA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#806A5A]">
              Statutory Lifecycle
            </span>
            <h2 className="text-section-heading font-display font-semibold text-[#3B2418] mt-2">
              The 8-Phase Land Acquisition Framework
            </h2>
            <p className="text-[#5A3928] text-base mt-2">
              Tracking risk accumulation through statutory proceedings from initial alignment to physical possession.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 8 Phase Pills */}
            <div className="lg:col-span-5 space-y-2">
              {acquisitionPhases.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    activePhaseIndex === idx
                      ? 'bg-[#3B2418] text-[#F7F3EA] border-[#3B2418] shadow-sandal-sm'
                      : 'bg-[#FCFAF5] text-[#3B2418] border-[#DCCCB8] hover:bg-[#E9DDC8]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block">{phase.name}</span>
                    <span className={`text-[10px] font-mono ${activePhaseIndex === idx ? 'text-[#DCCCB8]' : 'text-[#806A5A]'}`}>
                      {phase.statute}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    phase.riskScore >= 70
                      ? 'bg-[#B54036] text-white'
                      : phase.riskScore >= 50
                      ? 'bg-[#B85E3B] text-white'
                      : 'bg-[#65704C] text-white'
                  }`}>
                    {phase.riskScore}%
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Phase Details Box */}
            <div className="lg:col-span-7 bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#DCCCB8] shadow-sandal-lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCCCB8] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#B85E3B]">
                    PHASE SPECIFICATION
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-[#3B2418] mt-0.5">
                    {acquisitionPhases[activePhaseIndex].name}
                  </h3>
                  <p className="text-xs text-[#806A5A] font-mono">
                    Statutory Context: {acquisitionPhases[activePhaseIndex].statute}
                  </p>
                </div>
                <RiskBadge level={acquisitionPhases[activePhaseIndex].riskLevel} />
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#DCCCB8]">
                  <span className="text-[10px] uppercase font-bold text-[#B54036] block mb-1">
                    ⚠️ Primary Delay Driver at this Phase:
                  </span>
                  <p className="text-sm font-semibold text-[#3B2418]">
                    {acquisitionPhases[activePhaseIndex].riskDriver}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#3B2418] text-[#F7F3EA] border border-[#5A3928]">
                  <span className="text-[10px] uppercase font-bold text-[#C87552] block mb-1">
                    🛡️ Recommended Statutory Intervention:
                  </span>
                  <p className="text-xs text-[#E9DDC8] leading-relaxed">
                    {acquisitionPhases[activePhaseIndex].mitigation}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCCCB8] flex items-center justify-between">
                <span className="text-xs text-[#806A5A]">Phase {activePhaseIndex + 1} of 8</span>
                <button
                  onClick={() => setActivePhaseIndex((activePhaseIndex + 1) % acquisitionPhases.length)}
                  className="text-xs font-semibold text-[#B85E3B] hover:text-[#3B2418] flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PREDICTION COUNT-UP & EXPLAINABLE AI */}
      <section id="methodology" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#E9DDC8]/30 border-t border-[#DCCCB8]">
        <div id="prediction-section" className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B85E3B] bg-[#FCFAF5] px-3.5 py-1 rounded-full border border-[#DCCCB8]">
              Methodology & Explainable AI
            </span>
            <h2 className="text-section-heading font-display font-semibold text-[#3B2418] mt-3">
              Predicting the friction before it stalls.
            </h2>
            <p className="text-[#5A3928] text-base mt-2">
              Multi-source administrative signals synthesize into a single calibrated risk score.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Giant Score Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#FCFAF5] rounded-3xl border border-[#DCCCB8] shadow-sandal text-center">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#806A5A] mb-2">
                DELAY RISK INDEX
              </span>

              <div className="relative my-3 flex items-center justify-center">
                <div className="text-7xl sm:text-8xl font-display font-bold text-[#B54036] tracking-tight">
                  {animatedRisk}
                </div>
                <span className="text-2xl font-semibold text-[#806A5A] self-end mb-4 ml-1">
                  / 100
                </span>
              </div>

              <RiskBadge level="CRITICAL" size="lg" />

              <div className="mt-4 pt-4 border-t border-[#DCCCB8] w-full text-center">
                <span className="text-xs font-medium text-[#5A3928]">Estimated Delay Overrun:</span>
                <span className="text-base font-semibold text-[#3B2418] ml-1.5">+8.5 Months</span>
              </div>
            </div>

            {/* Right: Explainable AI "Why?" Breakdown */}
            <div className="lg:col-span-7 space-y-3">
              <div className="mb-2">
                <h3 className="text-card-heading font-display font-semibold text-[#3B2418]">
                  Explainable AI Factor Decomposition
                </h3>
                <p className="text-xs text-[#5A3928]">
                  Factor weights driving the 82/100 risk score on Madurai South:
                </p>
              </div>

              {[
                { name: 'Ownership Conflict & Unmutated Succession', pts: '+24', pct: 85, color: 'bg-[#B85E3B]' },
                { name: 'Legal Injunctions & Civil Court Precedents', pts: '+18', pct: 72, color: 'bg-[#806A5A]' },
                { name: 'Population Impact & Settlement Density', pts: '+15', pct: 60, color: 'bg-[#C87552]' },
                { name: 'Compensation Disparity (>1.8x Circle Rate)', pts: '+11', pct: 45, color: 'bg-[#DCCCB8]' },
                { name: 'Documentation & Bhoomi Record Mismatch', pts: '+6', pct: 30, color: 'bg-[#65704C]' },
              ].map((factor) => (
                <div key={factor.name} className="bg-[#FCFAF5] p-3.5 rounded-2xl border border-[#DCCCB8]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#3B2418] mb-1">
                    <span>{factor.name}</span>
                    <span className="font-mono text-[#B85E3B] bg-[#F7F3EA] px-2 py-0.5 rounded text-[11px]">
                      {factor.pts}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9DDC8] overflow-hidden">
                    <div style={{ width: `${factor.pct}%` }} className={`h-full ${factor.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F3EA] text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#B85E3B] bg-[#FCFAF5] px-3.5 py-1 rounded-full border border-[#DCCCB8]">
            Decision Support System
          </span>
          <h2 className="text-hero font-display font-semibold text-[#3B2418] mt-6">
            Know the risk. <br />
            <span className="text-[#B85E3B]">Act before the delay.</span>
          </h2>
          <p className="text-[#5A3928] text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed font-normal">
            Enter the production command center to monitor state corridors, run radius simulations, and generate intelligence briefs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              size="lg"
              variant="primary"
              onClick={handleExplore}
              icon={<ArrowRight className="w-4 h-4" />}
              className="cursor-pointer"
            >
              Explore LANDLYTICS →
            </MagneticButton>

            <MagneticButton
              size="lg"
              variant="outline"
              onClick={handleRiskMap}
              icon={<Compass className="w-4 h-4 text-[#B85E3B]" />}
              className="cursor-pointer"
            >
              Explore Risk Map
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 8. EDITORIAL FOOTER */}
      <footer className="bg-[#3B2418] text-[#E9DDC8] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#5A3928] text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="font-semibold text-[#F7F3EA] text-base font-display">
              LANDLYTICS — Land Acquisition Intelligence
            </p>
            <p className="text-[#DCCCB8] mt-1">
              Department of Land Resources (DoLR) • Ministry of Rural Development
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#DCCCB8]">
            <span>Predictive Geospatial Intelligence</span>
            <span>•</span>
            <span>RFCTLARR 2013 & NHAI Act Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
