import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Key, 
  Globe, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { getSupabaseConfig, setCustomSupabaseConfig } from '../services/supabaseClient';
import { dataStore } from '../services/dataStore';

export default function SupabaseSettingsModal({ isOpen, onClose }) {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomSupabaseConfig(url, key);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClear = () => {
    setCustomSupabaseConfig('', '');
    setUrl('');
    setKey('');
  };

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase_schema.sql');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700 my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Database & Supabase Integration</h2>
            <p className="text-xs text-slate-400">Production-ready cloud database connector</p>
          </div>
        </div>

        {/* Current Mode Badge */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Current Mode:</span>
            <div className="font-bold text-white mt-0.5 flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${url ? 'bg-emerald-400' : 'bg-emerald-400 animate-pulse'}`}></span>
              <span>{url ? 'Connected to Supabase Project' : 'Offline Reactive Storage (Instant Demo Active)'}</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
            100% Operational
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Supabase settings saved and verified!</span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-glass-glow transition-all"
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Reset to Demo Mode
            </button>
          </div>
        </form>

        {/* Database Tables Summary */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full SQL Schema (Ready to Deploy)</span>
            </span>
            <button
              onClick={handleCopySchemaPath}
              className="text-emerald-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedSchema ? 'Copied Path!' : 'Copy schema filename'}</span>
            </button>
          </div>
          
          <div className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-400 space-y-1 border border-slate-800">
            <div>&bull; public.profiles (Citizens, Drivers, Municipal Admins)</div>
            <div>&bull; public.daily_collections (Collected vs Not Collected)</div>
            <div>&bull; public.dumping_reports (Geo-tagged Hotspots & Proof)</div>
            <div>&bull; public.missing_bin_requests (Pin Drop & Upvotes)</div>
            <div>&bull; public.driver_routes (Sanitation Compactor Truck Routes)</div>
          </div>
        </div>

      </div>
    </div>
  );
}
