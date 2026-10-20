import React, { useState } from 'react';
import { 
  Trash2, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  User, 
  Flame, 
  Menu, 
  X, 
  Database, 
  Sparkles,
  Award,
  Layers,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { dataStore } from '../services/dataStore';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenAuth, 
  onOpenSettings,
  user
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleSwitch = (newRole) => {
    dataStore.switchRole(newRole);
    setRoleDropdownOpen(false);
    // Switch to respective tab
    if (newRole === 'citizen') setCurrentTab('citizen');
    else if (newRole === 'driver') setCurrentTab('driver');
    else if (newRole === 'admin') setCurrentTab('admin');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Ward Authority', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'driver':
        return { label: 'Sanitation Crew', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Citizen', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('citizen')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-glass-glow">
              <Trash2 className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  CIVIC<span className="text-emerald-400">-BIN</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tracker
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart Waste Management & Geo-Reporting</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setCurrentTab('citizen')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                currentTab === 'citizen'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setCurrentTab('daily-tracker')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                currentTab === 'daily-tracker'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Daily Collection</span>
            </button>

            <button
              onClick={() => setCurrentTab('heatmap')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                currentTab === 'heatmap'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Dumping Heatmap</span>
            </button>

            <button
              onClick={() => setCurrentTab('missing-bins')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                currentTab === 'missing-bins'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Missing Bins</span>
            </button>

            {/* Role Dashboards */}
            <button
              onClick={() => setCurrentTab('driver')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'driver'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/40'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Driver</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'admin'
                  ? 'bg-purple-500 text-white shadow-md font-bold'
                  : 'text-purple-300/80 hover:text-purple-200 hover:bg-purple-950/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ward Admin</span>
            </button>
          </nav>

          {/* User Controls & Quick Role Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Civic Points Badge */}
            {user && (
              <div 
                title="Civic Impact Score: Earn points by reporting dumps, marking collections, and upvoting bins"
                className="hidden lg:flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.civic_points || 150} pts</span>
              </div>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${roleInfo.bg}`}
              >
                <span>{roleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel-glow py-2 z-50 border border-slate-700 shadow-2xl animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('citizen')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-300"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-bold">Citizen Mode</div>
                      <div className="text-[10px] text-slate-400">Mark street, report dumps, upvote bins</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('driver')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-slate-200 hover:bg-amber-500/20 hover:text-amber-300"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold">Truck Driver / Crew</div>
                      <div className="text-[10px] text-slate-400">Route map, clear dumps, weigh waste</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-slate-200 hover:bg-purple-500/20 hover:text-purple-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="font-bold">Ward Municipal Authority</div>
                      <div className="text-[10px] text-slate-400">Dispatch crew, SLA alerts, bin tenders</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Supabase Config / Database Button */}
            <button
              onClick={onOpenSettings}
              title="Database & Supabase Configuration"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-all border border-transparent hover:border-slate-700"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Login / Profile button */}
            {user ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 p-1.5 sm:px-3 rounded-xl transition-all"
              >
                <img 
                  src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.phone}`} 
                  alt="avatar" 
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40" 
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                  {user.full_name}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-glass-glow transition-all"
              >
                Mobile Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-2 animate-slide-up">
            <button
              onClick={() => { setCurrentTab('citizen'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 ${
                currentTab === 'citizen' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => { setCurrentTab('daily-tracker'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 ${
                currentTab === 'daily-tracker' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>Daily Collection Status</span>
            </button>

            <button
              onClick={() => { setCurrentTab('heatmap'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 ${
                currentTab === 'heatmap' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Open Dumping Heatmap</span>
            </button>

            <button
              onClick={() => { setCurrentTab('missing-bins'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 ${
                currentTab === 'missing-bins' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>Missing Bin Locator</span>
            </button>

            <div className="pt-2 border-t border-slate-800/60 flex space-x-2">
              <button
                onClick={() => { setCurrentTab('driver'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1.5 ${
                  currentTab === 'driver' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Driver Crew</span>
              </button>

              <button
                onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1.5 ${
                  currentTab === 'admin' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-purple-300 border border-purple-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ward Admin</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
