import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ThumbsUp, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Users, 
  Filter, 
  X, 
  ArrowUpRight,
  ShieldCheck,
  Recycle,
  Cpu,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataStore } from '../services/dataStore';

const BIN_TYPES = [
  { 
    id: 'segregated_pair', 
    name: 'Dual Segregated Wet & Dry Bins', 
    desc: 'Color-coded twin bins for organic food vs. recyclable paper/plastic in pedestrian areas.',
    icon: Trash2,
    color: 'emerald'
  },
  { 
    id: 'heavy_commercial', 
    name: '1100L Heavy Wheeled Dumpster', 
    desc: 'Heavy-duty commercial container for morning tea stalls, bakeries, and busy shopping lanes.',
    icon: Layers,
    color: 'amber'
  },
  { 
    id: 'e_waste', 
    name: 'E-Waste & Battery Safe Deposit Box', 
    desc: 'Secured drop kiosk for spent batteries, smartphone chargers, and damaged electronics.',
    icon: Cpu,
    color: 'purple'
  },
  { 
    id: 'dry_recyclable', 
    name: 'Dry Plastic & Carton Recovery Bin', 
    desc: 'High-capacity wire-mesh container specifically designed for plastic bottles and cups.',
    icon: Recycle,
    color: 'cyan'
  },
  { 
    id: 'organic_wet', 
    name: 'Organic Wet Waste Compost Hopper', 
    desc: 'Ventilated bin for fruit peels, flower garlands, and fresh green kitchen waste.',
    icon: Trash2,
    color: 'green'
  }
];

export default function MissingBinLocator({ user, onOpenAuth }) {
  const [requests, setRequests] = useState(dataStore.getMissingBins());
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'voting' | 'approved' | 'installed'
  
  // New request form state
  const [title, setTitle] = useState('');
  const [binType, setBinType] = useState('segregated_pair');
  const [locationName, setLocationName] = useState('');
  const [desc, setDesc] = useState('');
  const [lat, setLat] = useState(19.0790);
  const [lng, setLng] = useState(72.8750);

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setRequests(dataStore.getMissingBins());
    });
    return () => unsub();
  }, []);

  const handleUpvote = (id) => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    dataStore.upvoteMissingBin(id);

    try {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#10b981', '#3b82f6']
      });
    } catch (e) {}
  };

  const handleOpenModal = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    // Randomize nearby coordinates
    setLat(19.0760 + (Math.random() - 0.5) * 0.02);
    setLng(72.8777 + (Math.random() - 0.5) * 0.02);
    setShowModal(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!title || !locationName) return;

    dataStore.addMissingBinRequest({
      title,
      bin_type: binType,
      description: desc || 'High pedestrian footfall with zero existing municipal bins.',
      latitude: lat,
      longitude: lng,
      location_name: locationName,
      ward_number: user?.ward_number || 'Ward 14 (Greenwood)'
    });

    setShowModal(false);
    setTitle('');
    setLocationName('');
    setDesc('');

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });
    } catch (e) {}
  };

  const handleAdminApprove = (id) => {
    dataStore.approveBinInstallation(id);
  };

  const handleAdminInstalled = (id) => {
    dataStore.markBinInstalled(id);
  };

  const filteredRequests = requests.filter(req => {
    if (filterType === 'all') return true;
    if (filterType === 'voting') return req.status === 'community_voting';
    if (filterType === 'approved') return req.status === 'approved_for_installation';
    if (filterType === 'installed') return req.status === 'installed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Infrastructure Request Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Missing Bin Locator & Community Voting
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Drop a pin where litter piles up because dustbins are missing. When a request hits <strong className="text-emerald-400">25 community upvotes</strong>, the Municipal Authority automatically issues an installation tender.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-glass-glow flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Request New Bin Installation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex space-x-1 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilterType('voting')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === 'voting' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Active Voting ({requests.filter(r => r.status === 'community_voting').length})
          </button>
          <button
            onClick={() => setFilterType('approved')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === 'approved' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Approved for Tender ({requests.filter(r => r.status === 'approved_for_installation').length})
          </button>
          <button
            onClick={() => setFilterType('installed')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === 'installed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Installed ({requests.filter(r => r.status === 'installed').length})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-1.5 px-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Each upvote awards +5 Civic Points</span>
        </div>
      </div>

      {/* Grid of Community Bin Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRequests.map((req) => {
          const typeObj = BIN_TYPES.find(t => t.id === req.bin_type) || BIN_TYPES[0];
          const hasUpvoted = req.upvoted_by?.includes(user?.id);
          const progressPercent = Math.min(100, Math.round((req.upvotes_count / req.target_threshold) * 100));
          const isApproved = req.status === 'approved_for_installation';
          const isInstalled = req.status === 'installed';

          return (
            <div 
              key={req.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isInstalled 
                  ? 'glass-panel border-emerald-500/40 shadow-glass-glow' 
                  : isApproved 
                    ? 'glass-card-amber border-amber-500/40' 
                    : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <typeObj.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                        {typeObj.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{req.ward_number}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    isInstalled 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : isApproved 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {isInstalled ? 'Installed & Active' : isApproved ? 'Municipal Approved' : 'Community Voting'}
                  </span>
                </div>

                {/* Title & Location */}
                <h3 className="text-base font-bold text-white mt-3.5 tracking-tight">
                  {req.title}
                </h3>

                <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium truncate">{req.location_name}</span>
                </div>

                <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                  {req.description}
                </p>

                {/* Target Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{req.upvotes_count} Community Supporters</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {isInstalled || isApproved ? 'Threshold Met' : `${Math.max(0, req.target_threshold - req.upvotes_count)} votes needed`}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div 
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInstalled 
                          ? 'bg-emerald-500 shadow-glass-glow' 
                          : isApproved 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                
                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(req.id)}
                  disabled={isInstalled}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    hasUpvoted 
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md' 
                      : isInstalled 
                        ? 'bg-slate-900 text-slate-500 cursor-not-allowed'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{hasUpvoted ? 'Upvoted' : 'Support This Bin (+1)'}</span>
                </button>

                {/* Admin Quick Action Controls */}
                {user?.role === 'admin' && (
                  <div className="flex space-x-2">
                    {!isApproved && !isInstalled && (
                      <button
                        onClick={() => handleAdminApprove(req.id)}
                        className="py-2.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/40 transition-all flex items-center space-x-1"
                        title="Approve installation tender directly as Ward Authority"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {isApproved && !isInstalled && (
                      <button
                        onClick={() => handleAdminInstalled(req.id)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold border border-emerald-500/40 transition-all flex items-center space-x-1"
                        title="Confirm bin installation completion"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Installed</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Request New Bin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700 my-8">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Drop Pin: Request Public Dustbin</h2>
                <p className="text-xs text-slate-400">Rally neighborhood votes to get municipal approval</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              
              {/* Bin Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  1. Dustbin Type Required
                </label>
                <div className="space-y-2">
                  {BIN_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setBinType(type.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                        binType === type.id 
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-sm' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <type.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-bold">{type.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{type.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Request Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dual Wet/Dry Dustbins needed at Bus Terminal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Location Name & Pin Coordinate Readout */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exact Location / Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus Stand #4, Junction of Oak Ridge & Maple"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Pinned GPS:</span>
                <span className="font-mono text-cyan-300">{lat.toFixed(4)} N, {lng.toFixed(4)} E</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Why is a bin urgently required here?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Heavy commuter litter during evening peak hours..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-glass-glow flex items-center justify-center space-x-2 transition-all mt-4"
              >
                <MapPin className="w-4 h-4 stroke-[2.5]" />
                <span>Publish Request to Community (+30 pts)</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
