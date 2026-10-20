import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Scale, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Flame, 
  Sparkles, 
  Check, 
  Navigation,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataStore } from '../services/dataStore';

export default function DriverDashboard({ user }) {
  const [routeStops, setRouteStops] = useState(dataStore.getDriverRoute());
  const [dumpReports, setDumpReports] = useState(dataStore.getDumpingReports());
  const [selectedProofDump, setSelectedProofDump] = useState(null);
  const [skipModalStop, setSkipModalStop] = useState(null);
  const [skipReason, setSkipReason] = useState('Road blocked by construction');
  const [truckPayloadKg, setTruckPayloadKg] = useState(4200);

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setRouteStops(dataStore.getDriverRoute());
      setDumpReports(dataStore.getDumpingReports());
    });
    return () => unsub();
  }, []);

  const completedStops = routeStops.filter(s => s.status === 'completed').length;
  const skippedStops = routeStops.filter(s => s.status === 'skipped').length;
  const totalStops = routeStops.length;
  const completionRate = Math.round((completedStops / totalStops) * 100);

  const handleMarkStopCollected = (stopId) => {
    dataStore.updateStopStatus(stopId, 'completed');
    setTruckPayloadKg(prev => prev + 350);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b']
      });
    } catch (e) {}
  };

  const handleConfirmSkip = () => {
    if (!skipModalStop) return;
    dataStore.updateStopStatus(skipModalStop.id, 'skipped', skipReason);
    setSkipModalStop(null);
  };

  const handleCleanDumpSpot = (reportId) => {
    // Verified cleanup proof
    const sampleProofUrl = "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80";
    dataStore.updateDumpingStatus(reportId, 'cleaned', `${user?.full_name || 'Sanitation Crew'} (${user?.vehicle_number || 'Truck #4'})`, sampleProofUrl);
    setSelectedProofDump(null);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    } catch (e) {}
  };

  const assignedDumpTasks = dumpReports.filter(d => d.status !== 'cleaned');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-card-amber p-6 sm:p-8 border border-amber-500/30 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-amber-glow">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Active Shift &bull; Ward 14 Morning Route</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.full_name || 'Rajesh Kumar'} (Driver #4)
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Vehicle: {user?.vehicle_number || 'MH-12-GR-8890'} &bull; Compactor Truck 6.0T
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Progress</span>
              <div className="text-lg font-black text-white font-mono">{completedStops}/{totalStops}</div>
              <span className="text-[10px] text-emerald-400 font-bold">{completionRate}% Done</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Payload</span>
              <div className="text-lg font-black text-amber-400 font-mono">{(truckPayloadKg / 1000).toFixed(1)}T</div>
              <span className="text-[10px] text-slate-400">Max 6.0T</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Driver Layout: Route Stop Checklist & Open Dump Clearance Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Stops Checklist (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white">Street Collection Route Checklist</h3>
              <p className="text-xs text-slate-400">Mark stops collected or skipped along your GPS route</p>
            </div>
            <span className="text-xs bg-slate-900 px-3 py-1 rounded-xl text-slate-300 border border-slate-800">
              Shift Ends: 01:00 PM
            </span>
          </div>

          <div className="space-y-3">
            {routeStops.map((stop, index) => {
              const isCompleted = stop.status === 'completed';
              const isSkipped = stop.status === 'skipped';
              const isPending = stop.status === 'pending';

              return (
                <div 
                  key={stop.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted 
                      ? 'bg-slate-900/50 border-emerald-500/30' 
                      : isSkipped 
                        ? 'bg-amber-950/30 border-amber-500/40' 
                        : 'bg-slate-900/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-500 text-slate-950' 
                        : isSkipped 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{stop.street}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">({stop.houses} Houses)</span>
                      </div>
                      
                      <div className="text-xs mt-1 flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          isCompleted 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : isSkipped 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? `Collected at ${stop.timestamp}` : isSkipped ? `Skipped: ${stop.reason}` : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Action Buttons */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {!isCompleted && (
                      <button
                        onClick={() => handleMarkStopCollected(stop.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Collected</span>
                      </button>
                    )}

                    {!isCompleted && !isSkipped && (
                      <button
                        onClick={() => setSkipModalStop(stop)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/40 transition-all"
                      >
                        Skip
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Open Dumping Cleanup Missions (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-red-400 pb-3 border-b border-slate-800">
              <Flame className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Emergency Dump Missions</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Assigned illegal dumping piles requiring loader clearance & photographic clearance proof.
            </p>

            <div className="mt-4 space-y-3">
              {assignedDumpTasks.map((dump) => (
                <div key={dump.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start space-x-3">
                    <img src={dump.photo_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        dump.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {dump.severity}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{dump.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{dump.address_landmark}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCleanDumpSpot(dump.id)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-black border border-emerald-500/40 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Clearance Proof & Finish</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mt-4 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-white">Dispatch Control Radio</div>
            <div>Ward 14 Dispatch Office: Ch 08</div>
            <div className="text-emerald-400 font-mono">Signal: Strong &bull; GPS Active</div>
          </div>
        </div>

      </div>

      {/* Skip Reason Modal */}
      {skipModalStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-slate-700">
            <h3 className="text-lg font-black text-white">Report Street Skip Reason</h3>
            <p className="text-xs text-slate-400 mt-1">
              Why could the sanitation vehicle not service <strong className="text-white">{skipModalStop.street}</strong>?
            </p>

            <div className="mt-4 space-y-2">
              {[
                'Road blocked by parked vehicles / construction',
                'Compactor mechanical hydraulic failure',
                'Road closed for municipal pipe digging',
                'Narrow lane inaccessible by heavy vehicle',
                'Severe water logging / flooded passage'
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => setSkipReason(reason)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                    skipReason === reason 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mt-6 flex space-x-2">
              <button
                onClick={() => setSkipModalStop(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-amber-glow"
              >
                Submit Skip Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
