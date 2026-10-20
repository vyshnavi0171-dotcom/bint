import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DailyCollectionTracker from './components/DailyCollectionTracker';
import DumpingHeatMap from './components/DumpingHeatMap';
import MissingBinLocator from './components/MissingBinLocator';
import CitizenDashboard from './components/CitizenDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import { dataStore } from './services/dataStore';
import { 
  Trash2, 
  MapPin, 
  CheckCircle, 
  Flame, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Sparkles,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(dataStore.getCurrentUser());
  const [currentTab, setCurrentTab] = useState('citizen'); // 'citizen' | 'daily-tracker' | 'heatmap' | 'missing-bins' | 'driver' | 'admin'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setCurrentUser(dataStore.getCurrentUser());
    });
    return () => unsub();
  }, []);

  const handleLoginSuccess = (user, role) => {
    setCurrentUser(user);
    if (role === 'citizen') setCurrentTab('citizen');
    else if (role === 'driver') setCurrentTab('driver');
    else if (role === 'admin') setCurrentTab('admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Glassmorphic Navigation Bar */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        user={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Render Tab based on Active Selection */}
        {currentTab === 'citizen' && (
          <CitizenDashboard 
            user={currentUser}
            setCurrentTab={setCurrentTab}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'daily-tracker' && (
          <DailyCollectionTracker 
            user={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'heatmap' && (
          <DumpingHeatMap 
            user={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'missing-bins' && (
          <MissingBinLocator 
            user={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'driver' && (
          <DriverDashboard 
            user={currentUser}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard 
            user={currentUser}
          />
        )}

      </main>

      {/* Modern Civic Tech Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white tracking-tight">Civic-Bin Tracker &bull; Urban Cleanliness Platform</div>
                <div className="text-slate-400">Transforming municipal waste collection through real-time civic participation</div>
              </div>
            </div>

            {/* Quick Switch Persona Pills */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Active Persona:</span>
              <button
                onClick={() => { dataStore.switchRole('citizen'); setCurrentTab('citizen'); }}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  currentUser?.role === 'citizen' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => { dataStore.switchRole('driver'); setCurrentTab('driver'); }}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  currentUser?.role === 'driver' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Truck Crew
              </button>
              <button
                onClick={() => { dataStore.switchRole('admin'); setCurrentTab('admin'); }}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  currentUser?.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ward Authority
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <span>Empowering cleaner neighborhoods</span>
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            </div>

          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SupabaseSettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

    </div>
  );
}
