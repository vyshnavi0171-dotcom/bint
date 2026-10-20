import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Award, 
  Truck, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Clock, 
  Home,
  CheckCircle2,
  ThumbsUp,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataStore } from '../services/dataStore';

export default function CitizenDashboard({ user, setCurrentTab, onOpenAuth }) {
  const [userStatus, setUserStatus] = useState(dataStore.getUserTodayCollectionStatus());
  const [stats, setStats] = useState(dataStore.getNeighborhoodStats());
  const [recentReports, setRecentReports] = useState(dataStore.getDumpingReports().slice(0, 3));
  const [trendingBins, setTrendingBins] = useState(dataStore.getMissingBins().slice(0, 2));

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setUserStatus(dataStore.getUserTodayCollectionStatus());
      setStats(dataStore.getNeighborhoodStats());
      setRecentReports(dataStore.getDumpingReports().slice(0, 3));
      setTrendingBins(dataStore.getMissingBins().slice(0, 2));
    });
    return () => unsub();
  }, []);

  const handleQuickMarkCollected = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    dataStore.markCollectionStatus('collected', 'Fast-verified from citizen portal');
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    } catch (e) {}
  };

  const handleQuickMarkNotCollected = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    dataStore.markCollectionStatus('not_collected', '', 'Truck did not arrive in lane');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Citizen Welcome Hero */}
      <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-10 border border-emerald-500/30 overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen Empowerment Hub &bull; {user?.ward_number || 'Ward 14 (Greenwood)'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.full_name || 'Civic Champion'}</span>!
            </h1>
            
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Your neighborhood waste collection is currently <strong className="text-emerald-400">{stats.percentage}% completed</strong> today. Keep your street clean and earn civic impact rewards.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentTab('daily-tracker')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-glass-glow flex items-center space-x-2 transition-all"
              >
                <span>Full Daily Collection Ledger</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTab('heatmap')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 transition-all"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>View Dumping Hotspots</span>
              </button>
            </div>
          </div>

          {/* Quick House Status Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700/80 min-w-[280px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Household Status</span>
              <span className="text-[11px] font-mono text-emerald-400">{user?.house_no || 'B-42'}</span>
            </div>

            <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
              userStatus?.status === 'collected'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : userStatus?.status === 'not_collected'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                userStatus?.status === 'collected'
                  ? 'bg-emerald-500 text-slate-950'
                  : userStatus?.status === 'not_collected'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
              }`}>
                {userStatus?.status === 'collected' ? (
                  <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase">
                  {userStatus?.status === 'collected' ? 'Collected Today' : userStatus?.status === 'not_collected' ? 'Skipped / Uncollected' : 'Pending Status'}
                </div>
                <div className="text-[11px] opacity-80">{userStatus?.timestamp || 'Mark your status below'}</div>
              </div>
            </div>

            {/* Quick Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleQuickMarkCollected}
                className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition-all text-center"
              >
                Mark Collected
              </button>
              <button
                onClick={handleQuickMarkNotCollected}
                className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition-all text-center"
              >
                Mark Skipped
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Live Collection Route Radar Simulation */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Sanitation Compactor Truck &bull; Crew #4</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  MH-12-GR-8890
                </span>
              </h3>
              <p className="text-xs text-slate-400">Current position: Lotus Valley Lane &bull; Speed: 14 km/h</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Estimated Arrival in Your Street:</span>
            <div className="text-emerald-400 font-mono font-bold text-sm">~ 15 to 20 Minutes</div>
          </div>
        </div>

        {/* Route Progress Dots */}
        <div className="mt-6">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 -z-0" style={{ width: '68%' }}></div>

            {[
              { label: 'Depot Start', done: true, time: '07:00 AM' },
              { label: 'Central Market', done: true, time: '07:30 AM' },
              { label: 'Oak Ridge Blvd', done: true, time: '08:45 AM' },
              { label: 'Maple Grove', done: true, time: '09:15 AM' },
              { label: 'Your Sector', active: true, time: 'ETA 10:15 AM' },
              { label: 'Lotus Valley', pending: true, time: '10:45 AM' },
            ].map((stop, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                  stop.done 
                    ? 'bg-emerald-500 border-white text-slate-950' 
                    : stop.active 
                      ? 'bg-amber-500 border-white text-slate-950 animate-ping-subtle' 
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}>
                  {stop.done ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-semibold text-slate-300 mt-2 hidden sm:block text-center max-w-[70px]">
                  {stop.label}
                </span>
                <span className="text-[9px] text-slate-500 hidden sm:block font-mono">
                  {stop.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Dumping Alerts & Infrastructure Upvotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Open Dumping Live Alerts */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">Recent Neighborhood Dumps</h3>
            </div>
            <button
              onClick={() => setCurrentTab('heatmap')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map(rep => (
              <div key={rep.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start space-x-3">
                <img src={rep.photo_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-700" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      rep.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rep.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rep.status === 'cleaned' ? 'Cleaned' : 'Pending Action'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-1">{rep.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{rep.address_landmark}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Bins Waiting For Upvotes */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Trending Bin Petitions</h3>
            </div>
            <button
              onClick={() => setCurrentTab('missing-bins')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trendingBins.map(bin => {
              const progress = Math.min(100, Math.round((bin.upvotes_count / bin.target_threshold) * 100));
              return (
                <div key={bin.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-white">{bin.title}</h4>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                      {bin.upvotes_count}/{bin.target_threshold} votes
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{bin.location_name}</p>
                  
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${progress}%` }} className="h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
