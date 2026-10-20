import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Camera, 
  MapPin, 
  Upload, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Filter, 
  X, 
  Plus, 
  Layers, 
  ExternalLink,
  Sparkles,
  Maximize2
} from 'lucide-react';
import L from 'leaflet';
import { dataStore } from '../services/dataStore';

const SAMPLE_DUMP_PHOTOS = [
  { label: 'Mixed Overflow Pile', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80' },
  { label: 'Plastic Scrap Corner', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Drain Dump', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Commercial Packaging', url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80' },
];

export default function DumpingHeatMap({ user, onOpenAuth }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const heatCirclesLayerRef = useRef(null);

  const [reports, setReports] = useState(dataStore.getDumpingReports());
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProofPhoto, setSelectedProofPhoto] = useState(null);

  // Form State for New Report
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formSeverity, setFormSeverity] = useState('critical');
  const [formPhoto, setFormPhoto] = useState(SAMPLE_DUMP_PHOTOS[0].url);
  const [formLat, setFormLat] = useState(19.0760);
  const [formLng, setFormLng] = useState(72.8777);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  // Subscribe to data updates
  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setReports(dataStore.getDumpingReports());
    });
    return () => unsub();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const defaultCenter = [19.0760, 72.8777]; // Greenwood / Urban center
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: true,
      });

      // Dark sleek tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      heatCirclesLayerRef.current = L.layerGroup().addTo(map);
      leafletMapRef.current = map;
    }

    renderMapMarkers();

    return () => {
      // Map cleanup handled on unmount
    };
  }, [reports, filterSeverity, filterStatus]);

  // Render Custom Markers and Hotspot Radar Circles
  const renderMapMarkers = () => {
    const map = leafletMapRef.current;
    if (!map || !markersLayerRef.current || !heatCirclesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    heatCirclesLayerRef.current.clearLayers();

    const filtered = reports.filter(r => {
      const sevMatch = filterSeverity === 'all' || r.severity === filterSeverity;
      const statMatch = filterStatus === 'all' || r.status === filterStatus;
      return sevMatch && statMatch;
    });

    filtered.forEach(report => {
      const isCritical = report.severity === 'critical';
      const isCleaned = report.status === 'cleaned';
      
      const markerColor = isCleaned 
        ? '#10b981' 
        : isCritical 
          ? '#ef4444' 
          : '#f59e0b';

      // Hotspot accumulation circle
      const radius = isCritical ? 280 : isCleaned ? 120 : 180;
      const circle = L.circle([report.latitude, report.longitude], {
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: isCleaned ? 0.08 : isCritical ? 0.25 : 0.15,
        radius: radius,
        weight: isCritical ? 2 : 1,
        dashArray: isCleaned ? '4, 4' : null,
      });
      heatCirclesLayerRef.current.addLayer(circle);

      // Custom HTML Pulsing Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <div class="${isCritical ? 'pulsing-marker' : isCleaned ? 'pulsing-marker-emerald' : ''}" 
                 style="position: absolute; width: 36px; height: 36px; background: ${markerColor}40; border-radius: 50%;"></div>
            <div style="width: 24px; height: 24px; background: ${markerColor}; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                ${isCleaned 
                  ? '<polyline points="20 6 9 17 4 12"></polyline>' 
                  : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'}
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      // Click event
      marker.on('click', () => {
        setSelectedReport(report);
      });

      markersLayerRef.current.addLayer(marker);
    });
  };

  // Capture GPS Geolocation
  const handleCaptureGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormLat(lat);
          setFormLng(lng);
          setGpsCaptured(true);
          setIsLocating(false);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([lat, lng], 16);
          }
        },
        (err) => {
          console.warn('Geolocation failed or denied, using ward approximate:', err);
          // Set realistic neighborhood randomized coordinates
          const randomLat = 19.0760 + (Math.random() - 0.5) * 0.015;
          const randomLng = 72.8777 + (Math.random() - 0.5) * 0.015;
          setFormLat(randomLat);
          setFormLng(randomLng);
          setGpsCaptured(true);
          setIsLocating(false);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([randomLat, randomLng], 16);
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleOpenReportModal = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    handleCaptureGps();
    setShowReportModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formTitle || !formLandmark) return;

    dataStore.addDumpingReport({
      title: formTitle,
      description: formDesc || 'Accumulated roadside garbage needing municipal loader clearance.',
      latitude: Number(formLat),
      longitude: Number(formLng),
      address_landmark: formLandmark,
      ward_number: user?.ward_number || 'Ward 14 (Greenwood)',
      severity: formSeverity,
      photo_url: formPhoto,
    });

    setShowReportModal(false);
    // Reset form
    setFormTitle('');
    setFormDesc('');
    setFormLandmark('');

    // Center map on new pin
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([formLat, formLng], 16);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Quick Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Open Dumping Hotspots & GPS Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Illegal Waste Dumping Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Citizens geo-tag uncollected waste piles with photographic proof. Critical hotspots automatically dispatch municipal loaders.
          </p>
        </div>

        <button
          onClick={handleOpenReportModal}
          className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-amber-glow flex items-center justify-center space-x-2 transition-all"
        >
          <Camera className="w-4 h-4 stroke-[2.5]" />
          <span>Snap & Report Dumping Spot</span>
        </button>
      </div>

      {/* Main Map Viewport & Sidebar Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-2 relative glass-panel rounded-3xl p-3 border border-slate-800 h-[500px] sm:h-[580px] overflow-hidden flex flex-col">
          
          {/* Map Top Floating Controls */}
          <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            
            {/* Filter Pills */}
            <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 flex items-center space-x-1 text-xs">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  filterSeverity === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all ${
                  filterSeverity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-red-400 hover:bg-red-950/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Critical</span>
              </button>
              <button
                onClick={() => setFilterSeverity('medium')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  filterSeverity === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                Medium
              </button>
            </div>

            {/* Status Filter */}
            <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 flex items-center space-x-1 text-xs">
              <button
                onClick={() => setFilterStatus(filterStatus === 'cleaned' ? 'all' : 'cleaned')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all ${
                  filterStatus === 'cleaned' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Show Cleaned Up</span>
              </button>
            </div>

          </div>

          {/* Leaflet DOM Node */}
          <div ref={mapContainerRef} className="w-full h-full rounded-2xl"></div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700/80 text-[11px] flex items-center space-x-4 shadow-xl">
            <span className="flex items-center space-x-1.5 text-red-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Critical Dump</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium Pile</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Verified Cleaned</span>
            </span>
          </div>

        </div>

        {/* Selected Incident Detail Card / Hotspots Sidebar */}
        <div className="space-y-4">
          {selectedReport ? (
            <div className="glass-panel-glow rounded-3xl p-5 border border-slate-700 animate-fade-in space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    selectedReport.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : selectedReport.status === 'cleaned'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {selectedReport.status === 'cleaned' ? 'Cleaned Up & Verified' : `${selectedReport.severity} Severity`}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-tight">
                    {selectedReport.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High-res Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 h-44 group cursor-pointer"
                   onClick={() => setSelectedProofPhoto(selectedReport.cleanup_proof_url || selectedReport.photo_url)}>
                <img 
                  src={selectedReport.photo_url} 
                  alt="Dumping spot" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    {selectedReport.address_landmark}
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-300">
                    <Maximize2 className="w-3 h-3" />
                    <span>Enlarge</span>
                  </span>
                </div>
              </div>

              {/* Cleanup Proof Comparison if Cleaned */}
              {selectedReport.cleanup_proof_url && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Post-Cleanup Proof Verified</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{selectedReport.assigned_crew}</span>
                  </div>
                  <img 
                    src={selectedReport.cleanup_proof_url} 
                    alt="After cleanup" 
                    className="w-full h-28 object-cover rounded-xl border border-emerald-500/40" 
                  />
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedReport.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                <div className="text-slate-400">
                  <span>GPS Lat/Lng:</span>
                  <div className="font-mono text-white text-[10px] mt-0.5">
                    {Number(selectedReport.latitude).toFixed(4)}, {Number(selectedReport.longitude).toFixed(4)}
                  </div>
                </div>
                <div className="text-slate-400">
                  <span>Reported By:</span>
                  <div className="text-white font-medium truncate mt-0.5">
                    {selectedReport.reported_by_name}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Hotspots ({reports.filter(r => r.status !== 'cleaned').length})
                </h3>
                <span className="text-xs text-slate-400">Click to inspect</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => {
                      setSelectedReport(rep);
                      if (leafletMapRef.current) {
                        leafletMapRef.current.flyTo([rep.latitude, rep.longitude], 16);
                      }
                    }}
                    className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-start space-x-3"
                  >
                    <img 
                      src={rep.photo_url} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-700" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          rep.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {rep.severity}
                        </span>
                        <span className="text-[10px] text-slate-500">Ward 14</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{rep.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{rep.address_landmark}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: Report New Open Dumping Spot */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700 my-8">
            
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Geo-Tagged Dump Report</h2>
                <p className="text-xs text-slate-400">Automatic GPS capture & photographic evidence</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Photo Evidence Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  1. Dump Site Photo Evidence
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {SAMPLE_DUMP_PHOTOS.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormPhoto(sample.url)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer h-16 border-2 transition-all ${
                        formPhoto === sample.url ? 'border-red-500 ring-2 ring-red-500/40 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={sample.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex-1 cursor-pointer py-2 px-3 bg-slate-900 border border-dashed border-slate-700 rounded-xl text-center text-xs text-slate-300 hover:border-emerald-500 transition-all flex items-center justify-center space-x-2">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Custom Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormPhoto(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Automatic GPS Coordinate Capture Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    gpsCaptured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>GPS Coordinates</span>
                      {gpsCaptured && <span className="text-[10px] text-emerald-400 font-semibold">&bull; Captured</span>}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {formLat.toFixed(5)}, {formLng.toFixed(5)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isLocating}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-bold border border-slate-700 transition-all"
                >
                  {isLocating ? 'Locating...' : 'Refresh GPS'}
                </button>
              </div>

              {/* Title & Landmark */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Incident Title / Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken Glass & Garbage Spill blocking sidewalk"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exact Landmark & Street
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Opposite Post Office, 3rd Cross Junction"
                  value={formLandmark}
                  onChange={(e) => setFormLandmark(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Severity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormSeverity('low')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formSeverity === 'low' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Low (Minor Litter)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSeverity('medium')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formSeverity === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Medium (Overflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSeverity('critical')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formSeverity === 'critical' ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Critical (Biohazard)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe foul odor, dog scavenging, or drain blockage..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-slate-950 font-black text-sm shadow-amber-glow flex items-center justify-center space-x-2 transition-all mt-4"
              >
                <AlertOctagon className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Geo-Tagged Report (+50 pts)</span>
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Enlarged Photo Lightbox Modal */}
      {selectedProofPhoto && (
        <div 
          onClick={() => setSelectedProofPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <img src={selectedProofPhoto} alt="Proof" className="w-full h-full object-contain" />
            <button className="absolute top-4 right-4 p-2 bg-slate-900/80 rounded-full text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
