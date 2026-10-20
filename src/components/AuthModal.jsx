import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  Sparkles, 
  Truck, 
  User, 
  Building2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { INITIAL_PROFILES } from '../services/mockData';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('842910');
  const [showSimulatedSms, setShowSimulatedSms] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSelectDemoProfile = (profile) => {
    setPhoneNumber(profile.phone);
    setSelectedRole(profile.role);
    setFullName(profile.full_name);
    setErrorMsg('');
  };

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid mobile number (e.g., +91 98765 43210)');
      return;
    }
    setErrorMsg('');
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setStep('otp');
    setCountdown(45);
    setShowSimulatedSms(true);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otpCode];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpCode(newOtp);
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const entered = otpCode.join('');
    
    // For seamless testing, allow generatedOtp or '123456' or any 6 digits
    if (entered.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP');
      return;
    }

    // Process login in store
    const user = dataStore.loginWithPhone(phoneNumber, selectedRole, fullName);
    
    if (onLoginSuccess) {
      onLoginSuccess(user, selectedRole);
    }
    onClose();
  };

  const handleFillOtp = () => {
    setOtpCode(generatedOtp.split(''));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-glass-glow">
            {step === 'phone' ? <Phone className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {step === 'phone' ? 'Mobile Verification' : 'Enter 6-Digit OTP'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {step === 'phone' 
              ? 'Mandatory phone verification for civic accountability' 
              : `Code sent to ${phoneNumber}`}
          </p>
        </div>

        {/* Simulated SMS Notification Banner for ultra-realistic UX */}
        {showSimulatedSms && step === 'otp' && (
          <div className="mb-5 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-start space-x-3 text-xs text-emerald-200 animate-slide-up shadow-md">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>SIMULATED SMS NOTIFICATION</span>
                <span className="text-[10px] text-emerald-400">Just now</span>
              </div>
              <p className="mt-0.5 text-slate-300">
                Civic-Bin Tracker: Your secure login OTP is <strong className="text-emerald-300 font-mono text-sm tracking-wider">{generatedOtp}</strong>. Valid for 10 mins.
              </p>
              <button 
                type="button"
                onClick={handleFillOtp}
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Auto-fill "{generatedOtp}"
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Phone & Role Selection */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {/* Role Switch Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role / Purpose
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('citizen')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    selectedRole === 'citizen'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('driver')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    selectedRole === 'driver'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Sanitation Crew</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Ward Authority</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Pills */}
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                ⚡ Quick Demo Profiles (Click to test instantly):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INITIAL_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectDemoProfile(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
                  >
                    <span>{p.full_name.split(' ')[0]} ({p.role})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Full Name (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name (Optional for new users)
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-glass-glow flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <span>Request OTP Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Entry */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 text-center mb-3">
                Enter the 6-digit verification code
              </label>
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none shadow-inner"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-400 hover:text-white underline"
              >
                Change Phone
              </button>

              {countdown > 0 ? (
                <span>Resend OTP in <strong className="text-emerald-400">{countdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-glass-glow flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Access Dashboard</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
