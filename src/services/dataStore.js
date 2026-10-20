import { 
  INITIAL_PROFILES, 
  INITIAL_STREETS, 
  INITIAL_DUMPING_REPORTS, 
  INITIAL_MISSING_BIN_REQUESTS, 
  INITIAL_DRIVER_ROUTE 
} from './mockData';
import { getSupabaseClient } from './supabaseClient';

const STORAGE_KEYS = {
  USER: 'civic_bin_current_user',
  STREETS: 'civic_bin_streets',
  DUMPING_REPORTS: 'civic_bin_dumping_reports',
  MISSING_BINS: 'civic_bin_missing_bins',
  DRIVER_ROUTE: 'civic_bin_driver_route',
  DAILY_LOGS: 'civic_bin_daily_logs',
};

class DataStore {
  constructor() {
    this.listeners = new Set();
    this.initData();
  }

  initData() {
    // Current user defaults to citizen for immediate delight or loaded from storage
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    this.currentUser = savedUser ? JSON.parse(savedUser) : INITIAL_PROFILES[0];

    // Load or initialize streets
    const savedStreets = localStorage.getItem(STORAGE_KEYS.STREETS);
    this.streets = savedStreets ? JSON.parse(savedStreets) : INITIAL_STREETS;

    // Load or initialize dumping reports
    const savedDumping = localStorage.getItem(STORAGE_KEYS.DUMPING_REPORTS);
    this.dumpingReports = savedDumping ? JSON.parse(savedDumping) : INITIAL_DUMPING_REPORTS;

    // Load or initialize missing bins
    const savedBins = localStorage.getItem(STORAGE_KEYS.MISSING_BINS);
    this.missingBins = savedBins ? JSON.parse(savedBins) : INITIAL_MISSING_BIN_REQUESTS;

    // Load or initialize driver route
    const savedDriverRoute = localStorage.getItem(STORAGE_KEYS.DRIVER_ROUTE);
    this.driverRoute = savedDriverRoute ? JSON.parse(savedDriverRoute) : INITIAL_DRIVER_ROUTE;

    // Load daily collection logs
    const savedDailyLogs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    this.dailyLogs = savedDailyLogs ? JSON.parse(savedDailyLogs) : {
      'Oak Ridge Boulevard-B-42': {
        status: 'collected',
        timestamp: 'Today at 08:45 AM',
        date: new Date().toISOString().split('T')[0]
      }
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
    localStorage.setItem(STORAGE_KEYS.STREETS, JSON.stringify(this.streets));
    localStorage.setItem(STORAGE_KEYS.DUMPING_REPORTS, JSON.stringify(this.dumpingReports));
    localStorage.setItem(STORAGE_KEYS.MISSING_BINS, JSON.stringify(this.missingBins));
    localStorage.setItem(STORAGE_KEYS.DRIVER_ROUTE, JSON.stringify(this.driverRoute));
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(this.dailyLogs));

    this.listeners.forEach(fn => fn());
  }

  // --- Auth & Profile ---
  getCurrentUser() {
    return this.currentUser;
  }

  loginWithPhone(phone, role = 'citizen', fullName = null) {
    // Find existing profile or create one
    let profile = INITIAL_PROFILES.find(p => p.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    
    if (!profile) {
      profile = {
        id: `user-${Date.now()}`,
        phone: phone,
        full_name: fullName || (role === 'citizen' ? 'Citizen User' : role === 'driver' ? 'Sanitation Crew' : 'Zonal Officer'),
        role: role,
        ward_number: 'Ward 14 (Greenwood)',
        street_name: 'Oak Ridge Boulevard',
        house_no: 'B-42',
        civic_points: 100,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${phone}`
      };
    } else if (role && profile.role !== role) {
      // Allow switching demo roles
      profile = { ...profile, role };
    }

    this.currentUser = profile;
    this.notify();
    return profile;
  }

  switchRole(role) {
    if (!this.currentUser) return;
    const profile = INITIAL_PROFILES.find(p => p.role === role);
    if (profile) {
      this.currentUser = { ...profile };
    } else {
      this.currentUser = { ...this.currentUser, role };
    }
    this.notify();
  }

  logout() {
    this.currentUser = null;
    this.notify();
  }

  updateProfile(updates) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    this.notify();
  }

  // --- Daily Collection Status ---
  getStreets() {
    return this.streets;
  }

  getNeighborhoodStats() {
    const totalStreets = this.streets.length;
    const collectedCount = this.streets.filter(s => s.defaultStatus === 'collected').length;
    const notCollectedCount = totalStreets - collectedCount;
    const percentage = Math.round((collectedCount / totalStreets) * 100);

    const totalHouses = this.streets.reduce((acc, curr) => acc + curr.totalHouses, 0);
    const servicedHouses = this.streets
      .filter(s => s.defaultStatus === 'collected')
      .reduce((acc, curr) => acc + curr.totalHouses, 0);

    return {
      totalStreets,
      collectedCount,
      notCollectedCount,
      percentage,
      totalHouses,
      servicedHouses,
      skippedHouses: totalHouses - servicedHouses
    };
  }

  getUserTodayCollectionStatus() {
    if (!this.currentUser) return null;
    const key = `${this.currentUser.street_name || 'Oak Ridge Boulevard'}-${this.currentUser.house_no || 'B-42'}`;
    return this.dailyLogs[key] || {
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
  }

  markCollectionStatus(status, notes = '', reason = '') {
    if (!this.currentUser) return;
    const streetName = this.currentUser.street_name || 'Oak Ridge Boulevard';
    const houseNo = this.currentUser.house_no || 'B-42';
    const key = `${streetName}-${houseNo}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.dailyLogs[key] = {
      status,
      timestamp: `Today at ${timeString}`,
      date: now.toISOString().split('T')[0],
      notes,
      reason,
      markedBy: this.currentUser.full_name,
      role: this.currentUser.role
    };

    // Update street status aggregation if this is the user's primary street
    const streetIndex = this.streets.findIndex(s => s.name === streetName);
    if (streetIndex !== -1) {
      this.streets[streetIndex].defaultStatus = status;
      this.streets[streetIndex].lastCollectedTime = timeString;
      if (reason) {
        this.streets[streetIndex].reason = reason;
      } else {
        delete this.streets[streetIndex].reason;
      }
    }

    // Award civic points for participating
    if (this.currentUser) {
      this.currentUser.civic_points = (this.currentUser.civic_points || 0) + 15;
    }

    this.notify();
    return this.dailyLogs[key];
  }

  // --- Open Dumping Reports ---
  getDumpingReports() {
    return this.dumpingReports;
  }

  addDumpingReport(report) {
    const newReport = {
      id: `dump-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'reported',
      reported_by_name: this.currentUser?.full_name || 'Citizen User',
      reported_by_phone: this.currentUser?.phone || '+91 99999 00000',
      assigned_crew: null,
      cleanup_proof_url: null,
      cleaned_at: null,
      ...report
    };

    this.dumpingReports = [newReport, ...this.dumpingReports];
    
    // Civic reward for reporting
    if (this.currentUser) {
      this.currentUser.civic_points = (this.currentUser.civic_points || 0) + 50;
    }

    this.notify();
    return newReport;
  }

  updateDumpingStatus(reportId, newStatus, assignedCrew = null, cleanupProofUrl = null) {
    this.dumpingReports = this.dumpingReports.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: newStatus,
          assigned_crew: assignedCrew !== null ? assignedCrew : rep.assigned_crew,
          cleanup_proof_url: cleanupProofUrl || rep.cleanup_proof_url,
          cleaned_at: newStatus === 'cleaned' ? new Date().toISOString() : rep.cleaned_at
        };
      }
      return rep;
    });
    this.notify();
  }

  // --- Missing Bin Requests ---
  getMissingBins() {
    return this.missingBins;
  }

  addMissingBinRequest(request) {
    const newRequest = {
      id: `bin-req-${Date.now()}`,
      created_at: new Date().toISOString(),
      upvotes_count: 1,
      target_threshold: 25,
      status: 'community_voting',
      created_by_name: this.currentUser?.full_name || 'Citizen Contributor',
      upvoted_by: [this.currentUser?.id || 'guest'],
      ...request
    };

    this.missingBins = [newRequest, ...this.missingBins];
    
    // Reward for active urban improvement
    if (this.currentUser) {
      this.currentUser.civic_points = (this.currentUser.civic_points || 0) + 30;
    }

    this.notify();
    return newRequest;
  }

  upvoteMissingBin(requestId) {
    const userId = this.currentUser?.id || 'guest';
    this.missingBins = this.missingBins.map(bin => {
      if (bin.id === requestId) {
        const alreadyUpvoted = bin.upvoted_by?.includes(userId);
        let newUpvotedBy;
        let newCount;

        if (alreadyUpvoted) {
          // Toggle off
          newUpvotedBy = bin.upvoted_by.filter(id => id !== userId);
          newCount = Math.max(0, bin.upvotes_count - 1);
        } else {
          // Add upvote
          newUpvotedBy = [...(bin.upvoted_by || []), userId];
          newCount = bin.upvotes_count + 1;
        }

        // Automatic threshold status change
        let newStatus = bin.status;
        if (newCount >= bin.target_threshold && bin.status === 'community_voting') {
          newStatus = 'approved_for_installation';
        }

        return {
          ...bin,
          upvotes_count: newCount,
          upvoted_by: newUpvotedBy,
          status: newStatus
        };
      }
      return bin;
    });

    if (this.currentUser) {
      this.currentUser.civic_points = (this.currentUser.civic_points || 0) + 5;
    }

    this.notify();
  }

  approveBinInstallation(requestId) {
    this.missingBins = this.missingBins.map(bin => {
      if (bin.id === requestId) {
        return { ...bin, status: 'approved_for_installation' };
      }
      return bin;
    });
    this.notify();
  }

  markBinInstalled(requestId) {
    this.missingBins = this.missingBins.map(bin => {
      if (bin.id === requestId) {
        return { ...bin, status: 'installed' };
      }
      return bin;
    });
    this.notify();
  }

  // --- Driver Route Controls ---
  getDriverRoute() {
    return this.driverRoute;
  }

  updateStopStatus(stopId, newStatus, reason = '') {
    this.driverRoute = this.driverRoute.map(stop => {
      if (stop.id === stopId) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...stop,
          status: newStatus,
          timestamp: timeStr,
          reason: reason || stop.reason
        };
      }
      return stop;
    });

    // Also synchronize corresponding street status
    const stop = this.driverRoute.find(s => s.id === stopId);
    if (stop) {
      const streetIndex = this.streets.findIndex(st => st.name === stop.street);
      if (streetIndex !== -1) {
        this.streets[streetIndex].defaultStatus = newStatus === 'completed' ? 'collected' : 'not_collected';
        this.streets[streetIndex].lastCollectedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (reason) this.streets[streetIndex].reason = reason;
      }
    }

    this.notify();
  }

  // Reset to original demo data
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.STREETS);
    localStorage.removeItem(STORAGE_KEYS.DUMPING_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.MISSING_BINS);
    localStorage.removeItem(STORAGE_KEYS.DRIVER_ROUTE);
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    this.initData();
    this.notify();
  }
}

export const dataStore = new DataStore();
