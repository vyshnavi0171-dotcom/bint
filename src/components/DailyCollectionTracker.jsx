import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Home, 
  Building, 
  TrendingUp, 
  MapPin, 
  Filter, 
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Share2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataStore } from '../services/dataStore';

export default function DailyCollectionTracker({ user, onOpenAuth }) {
  const [streets, setStreets] = useState(dataStore.getStreets());
  const [stats, setStats] = useState(dataStore.getNeighborhoodStats());
  const [userStatus, setUserStatus] = useState(dataStore.getUserTodayCollectionStatus());
  const [selectedStreet, setSelectedStreet] = useState(user?.street_name || 'Oak Ridge Boulevard');
  const [houseNo, setHouseNo] = useState(user?.house_no || 'B-42');
  const [notCollectedReason, setNotCollectedReason] = useState('Truck did not arrive in lane');
  const [showReasonPicker, setShowReasonPicker] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'collected' | 'not_collected'
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setStreets(dataStore.getStreets());
      setStats(dataStore.getNeighborhoodStats());
      setUserStatus(dataStore.getUserTodayCollectionStatus());
    });
    return () => unsubscribe();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#059669', '#f59e0b']
      });
    } catch (e) {
      // Graceful fallback
    }
  };

  const handleMarkCollected = () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    dataStore.markCollectionStatus('collected', 'Verified by household resident');
    setShowReasonPicker(false);
    triggerConfetti();
    setToastMsg({ type: 'success', text: 'Marked as Collected! +15 Civic points earned.' });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleMarkNotCollected = (reason) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const finalReason = reason || notCollectedReason;
    dataStore.markCollectionStatus('not_collected', '', finalReason);
    setShowReasonPicker(false);
    setToastMsg({ type: 'warning', text: 'Reported as Not Collected. Alert dispatched to Ward Supervisor.' });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const filteredStreets = streets.filter(street => {
    const matchesSearch = street.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          street.ward.toLowerCase().includes(searchFilter.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && street.defaultStatus === filterType;
  });

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-slide-up ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 shadow-glass-glow'
            : 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-amber-glow'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
          <span className="text-sm font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* CORE HERO SECTION: Today's Collection Status Action Hub */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-8 lg:p-10 border border-emerald-500/30">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today's Daily Collection Log &bull; {todayFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Has your waste been collected today?
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
                Real-time neighborhood tracking empowers citizens to report skipped routes and holds municipal sanitation crews accountable.
              </p>
            </div>

            {/* Current Address Pill */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="text-slate-400 font-medium">Logged Address:</div>
                <div className="font-bold text-white truncate max-w-[160px]">
                  {houseNo}, {selectedStreet}
                </div>
                <div className="text-[11px] text-emerald-400">Ward 14 (Greenwood)</div>
              </div>
            </div>
          </div>

          {/* PROMINENT TOGGLE BUTTONS (Collected vs. Not Collected) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            
            {/* GREEN BADGE: COLLECTED */}
            <div 
              onClick={handleMarkCollected}
              className={`group relative cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300 border ${
                userStatus?.status === 'collected'
                  ? 'bg-gradient-to-br from-emerald-950/90 to-slate-900 border-emerald-500 shadow-glass-glow ring-2 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    userStatus?.status === 'collected'
                      ? 'bg-emerald-500 text-slate-950 shadow-glass-glow'
                      : 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950'
                  }`}>
                    <CheckCircle className="w-8 h-8 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl sm:text-2xl font-black text-white">COLLECTED</span>
                      {userStatus?.status === 'collected' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Sanitation truck arrived and cleared household bin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status details if active */}
              {userStatus?.status === 'collected' && (
                <div className="mt-4 pt-3 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Logged at {userStatus.timestamp || '08:45 AM'}</span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>+15 Civic Points</span>
                  </span>
                </div>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  className={`w-full py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all ${
                    userStatus?.status === 'collected'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{userStatus?.status === 'collected' ? 'Verified Today' : 'Confirm Collection'}</span>
                </button>
              </div>
            </div>

            {/* AMBER/RED ALERT BADGE: NOT COLLECTED */}
            <div 
              className={`group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 border ${
                userStatus?.status === 'not_collected'
                  ? 'bg-gradient-to-br from-amber-950/90 to-slate-900 border-amber-500 shadow-amber-glow ring-2 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-900/90'
              }`}
            >
              <div 
                onClick={() => setShowReasonPicker(!showReasonPicker)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      userStatus?.status === 'not_collected'
                        ? 'bg-amber-500 text-slate-950 shadow-amber-glow'
                        : 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950'
                    }`}>
                      <AlertTriangle className="w-8 h-8 stroke-[2.4]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl font-black text-white">NOT COLLECTED</span>
                        {userStatus?.status === 'not_collected' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">
                            Reported Alert
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Truck skipped street or left bins untouched.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status details if active */}
                {userStatus?.status === 'not_collected' && (
                  <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-300 font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reported {userStatus.timestamp}</span>
                    </div>
                    <span className="text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30 truncate max-w-[150px]">
                      {userStatus.reason || 'Truck skipped lane'}
                    </span>
                  </div>
                )}
              </div>

              {/* Reason Selector Dropdown */}
              {showReasonPicker ? (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 animate-slide-up">
                  <span className="text-xs font-bold text-slate-300 block mb-1">
                    Select Reason for Irregularity:
                  </span>
                  {[
                    'Truck did not arrive in lane today',
                    'Truck arrived too early (before 07:00 AM)',
                    'Driver skipped our half of the street',
                    'Road temporarily blocked by vehicle/construction',
                    'Garbage collectors refused unsegregated waste'
                  ].map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleMarkNotCollected(reason)}
                      className="w-full text-left p-2 rounded-xl text-xs text-slate-200 bg-slate-950/80 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 transition-all flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{reason}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowReasonPicker(true)}
                    className={`w-full py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all ${
                      userStatus?.status === 'not_collected'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/40 group-hover:bg-amber-500 group-hover:text-slate-950'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{userStatus?.status === 'not_collected' ? 'Update Incident Reason' : 'Report Uncollected'}</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* REAL-TIME AGGREGATION PULSE: Serviced vs. Skipped */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Neighborhood Efficiency Score Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Neighborhood Service Rate</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-5xl font-black text-white font-mono tracking-tight">{stats.percentage}%</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                +4% vs Yesterday
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-2">
              Ward 14 (Greenwood) aggregated collection completion for today.
            </p>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60">
              <div 
                style={{ width: `${stats.percentage}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-glass-glow"
              ></div>
              <div 
                style={{ width: `${100 - stats.percentage}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700"
              ></div>
            </div>

            <div className="flex justify-between text-xs font-bold pt-1">
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>{stats.collectedCount} Streets Serviced ({stats.percentage}%)</span>
              </span>
              <span className="text-amber-400 flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>{stats.notCollectedCount} Skipped ({100 - stats.percentage}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Total Households Reach */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Households Covered</span>
            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-4xl font-black text-white font-mono tracking-tight">
                {stats.servicedHouses} <span className="text-xl text-slate-500 font-normal">/ {stats.totalHouses}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Over {stats.skippedHouses} homes currently awaiting scheduled secondary sweep or compactor relief.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-slate-400">Avg Pickup Time</div>
              <div className="text-white font-bold text-sm mt-0.5 font-mono">08:52 AM</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-slate-400">Active Trucks</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5 font-mono">3 Compactor Trucks</div>
            </div>
          </div>
        </div>

        {/* Citizen Accountability Guarantee */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between bg-gradient-to-br from-slate-900/80 to-slate-950">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Ward SLA Guarantee</span>
            </div>
            <h3 className="text-base font-bold text-white mt-2">
              Automated Escalation Protocol
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              If a street remains marked as "Not Collected" past 11:30 AM with &ge; 5 resident reports, a high-priority ticket is automatically logged with the Zonal Health Inspector.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Sanitation Hotline:</span>
            <span className="font-mono font-bold text-emerald-400">1800-419-WASTE</span>
          </div>
        </div>

      </div>

      {/* DETAILED STREET-BY-STREET AUDIT DIRECTORY */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Street-Level Collection Ledger</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {filteredStreets.length} streets
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Live status reported across Greenwood Ward 14 streets today</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search street name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('collected')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'collected' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                Serviced
              </button>
              <button
                onClick={() => setFilterType('not_collected')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'not_collected' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                Skipped
              </button>
            </div>
          </div>
        </div>

        {/* Street Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreets.map((street) => {
            const isCollected = street.defaultStatus === 'collected';
            return (
              <div 
                key={street.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                  isCollected 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40' 
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCollected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {isCollected ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{street.name}</h4>
                      <div className="text-[11px] text-slate-400">{street.totalHouses} Registered Homes</div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    isCollected 
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    {isCollected ? 'Collected' : 'Skipped'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{street.lastCollectedTime}</span>
                  </span>

                  {street.reason && (
                    <span className="text-[10px] text-amber-400 italic truncate max-w-[140px]" title={street.reason}>
                      {street.reason}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
