import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Truck, 
  Flame, 
  MapPin, 
  FileText, 
  Download, 
  Sparkles, 
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataStore } from '../services/dataStore';

export default function AdminDashboard({ user }) {
  const [streets, setStreets] = useState(dataStore.getStreets());
  const [stats, setStats] = useState(dataStore.getNeighborhoodStats());
  const [dumpReports, setDumpReports] = useState(dataStore.getDumpingReports());
  const [missingBins, setMissingBins] = useState(dataStore.getMissingBins());
  const [selectedCrew, setSelectedCrew] = useState('Sanitation Rapid Crew #2');

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setStreets(dataStore.getStreets());
      setStats(dataStore.getNeighborhoodStats());
      setDumpReports(dataStore.getDumpingReports());
      setMissingBins(dataStore.getMissingBins());
    });
    return () => unsub();
  }, []);

  const handleDispatchCrew = (reportId) => {
    dataStore.updateDumpingStatus(reportId, 'assigned', selectedCrew);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#a855f7', '#3b82f6', '#10b981']
      });
    } catch (e) {}
  };

  const handleApproveBin = (binId) => {
    dataStore.approveBinInstallation(binId);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399']
      });
    } catch (e) {}
  };

  const handleExportReport = () => {
    const reportData = {
      exportDate: new Date().toISOString(),
      ward: user?.ward_number || 'Ward 14 (Greenwood)',
      collectionStats: stats,
      streetsAudit: streets,
      dumpingTickets: dumpReports,
      infrastructureRequests: missingBins
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicBin_Ward14_Audit_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unassignedDumps = dumpReports.filter(d => d.status === 'reported');
  const pendingBinPetitions = missingBins.filter(b => b.status === 'community_voting' || b.status === 'approved_for_installation');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Admin Executive Header */}
      <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-8 border border-purple-500/30 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Municipal Waste Administration Console &bull; {user?.ward_number || 'Ward 14'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.full_name || 'Dr. Sunita Rao'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Solid Waste Management Commissioner &bull; Central Control Room
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportReport}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Ward Audit</span>
            </button>
            <button
              onClick={() => dataStore.resetAllData()}
              title="Reset to default seed state"
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 p-2.5 rounded-xl text-xs transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Neighborhood Service Rate</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{stats.percentage}%</span>
            <span className="text-xs font-semibold text-emerald-400">({stats.collectedCount}/{stats.totalStreets} streets)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Target SLA threshold: &gt; 92%</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Skipped Streets Alert</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-mono">{stats.notCollectedCount}</span>
            <span className="text-xs font-semibold text-amber-400">({stats.skippedHouses} homes)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Auto-escalation tickets active</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Dumping Hotspots</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-red-400 font-mono">{dumpReports.filter(d => d.status !== 'cleaned').length}</span>
            <span className="text-xs font-semibold text-slate-400">({unassignedDumps.length} Unassigned)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Response SLA: &lt; 4 hours</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Bin Petitions</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">{missingBins.length}</span>
            <span className="text-xs font-semibold text-emerald-400">({missingBins.filter(b => b.status === 'approved_for_installation').length} Approved)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Community-backed infrastructure</div>
        </div>

      </div>

      {/* Two Column Command Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Open Dumping Rapid Crew Dispatch */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">Open Dumping Triage Queue</h3>
            </div>
            <span className="text-xs bg-red-500/10 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {dumpReports.filter(d => d.status !== 'cleaned').length} Action Items
            </span>
          </div>

          <div className="space-y-3">
            {dumpReports.filter(d => d.status !== 'cleaned').map(dump => (
              <div key={dump.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-start space-x-3">
                  <img src={dump.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        dump.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {dump.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">Status: {dump.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate mt-1">{dump.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{dump.address_landmark}</p>
                    <div className="text-[10px] text-emerald-400 font-mono mt-1">
                      Reported by: {dump.reported_by_name} ({dump.reported_by_phone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                  <select 
                    value={selectedCrew}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white flex-1 focus:outline-none"
                  >
                    <option value="Sanitation Rapid Crew #1">Crew #1 (Mini Tipper)</option>
                    <option value="Sanitation Rapid Crew #2">Crew #2 (Heavy Loader)</option>
                    <option value="Rajesh Kumar (Truck #4)">Rajesh Kumar (Compactor #4)</option>
                  </select>

                  <button
                    onClick={() => handleDispatchCrew(dump.id)}
                    className="py-1.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Dispatch Crew
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Bin Community Petitions Review */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Dustbin Tender Authorizations</h3>
            </div>
            <span className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {pendingBinPetitions.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingBinPetitions.map(bin => {
              const thresholdMet = bin.upvotes_count >= bin.target_threshold;
              const isApproved = bin.status === 'approved_for_installation';

              return (
                <div key={bin.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{bin.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{bin.location_name}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      thresholdMet ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {bin.upvotes_count} / {bin.target_threshold} Votes
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {bin.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-mono text-cyan-400">
                      Coordinates: {bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}
                    </span>

                    {!isApproved ? (
                      <button
                        onClick={() => handleApproveBin(bin.id)}
                        className="py-1.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all"
                      >
                        Approve Tender
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Procurement Sanctioned</span>
                      </span>
                    )}
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
