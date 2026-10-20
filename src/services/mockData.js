// Seed Data for Civic-Bin Tracker
export const INITIAL_PROFILES = [
  {
    id: "user-cit-01",
    phone: "+91 98765 43210",
    full_name: "Aarav Sharma",
    role: "citizen",
    ward_number: "Ward 14 (Greenwood)",
    street_name: "Oak Ridge Boulevard",
    house_no: "B-42",
    civic_points: 320,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "user-drv-01",
    phone: "+91 98111 22334",
    full_name: "Rajesh Kumar",
    role: "driver",
    ward_number: "Ward 14 (Greenwood)",
    vehicle_number: "MH-12-GR-8890",
    civic_points: 890,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "user-adm-01",
    phone: "+91 98999 88776",
    full_name: "Dr. Sunita Rao",
    role: "admin",
    ward_number: "Ward 14 & Zone 3",
    department: "Municipal Corporation Solid Waste Dept",
    civic_points: 1450,
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];

export const INITIAL_STREETS = [
  { id: "st-1", name: "Oak Ridge Boulevard", ward: "Ward 14 (Greenwood)", totalHouses: 85, defaultStatus: "collected", lastCollectedTime: "08:45 AM" },
  { id: "st-2", name: "Maple Grove Avenue", ward: "Ward 14 (Greenwood)", totalHouses: 64, defaultStatus: "collected", lastCollectedTime: "09:15 AM" },
  { id: "st-3", name: "Pinecrest Lane", ward: "Ward 14 (Greenwood)", totalHouses: 42, defaultStatus: "not_collected", lastCollectedTime: "Yesterday 08:20 AM", reason: "Compactor vehicle hydraulic breakdown" },
  { id: "st-4", name: "Cypress Crest Way", ward: "Ward 14 (Greenwood)", totalHouses: 50, defaultStatus: "collected", lastCollectedTime: "09:40 AM" },
  { id: "st-5", name: "Elm Street Extension", ward: "Ward 14 (Greenwood)", totalHouses: 72, defaultStatus: "not_collected", lastCollectedTime: "Pending Pickup", reason: "Driver rerouted due to culvert blockage" },
  { id: "st-6", name: "Silver Birch Road", ward: "Ward 14 (Greenwood)", totalHouses: 38, defaultStatus: "collected", lastCollectedTime: "10:05 AM" },
  { id: "st-7", name: "Riverfront Walkway", ward: "Ward 14 (Greenwood)", totalHouses: 55, defaultStatus: "collected", lastCollectedTime: "10:30 AM" },
  { id: "st-8", name: "Lotus Valley Lane", ward: "Ward 14 (Greenwood)", totalHouses: 90, defaultStatus: "not_collected", lastCollectedTime: "Pending Pickup", reason: "Route in progress" },
  { id: "st-9", name: "Central Market Boulevard", ward: "Ward 14 (Greenwood)", totalHouses: 110, defaultStatus: "collected", lastCollectedTime: "07:30 AM" }
];

export const INITIAL_DUMPING_REPORTS = [
  {
    id: "dump-001",
    title: "Overflowing Mixed Garbage behind Metro Pillar 142",
    description: "Massive pile of unsegregated plastic bags, food leftovers, and stray dog scavenging. Urgent clearance needed as it blocks pedestrian walkway.",
    latitude: 19.0760,
    longitude: 72.8777,
    address_landmark: "Opposite Metro Pillar 142, Service Road, Ward 14",
    ward_number: "Ward 14 (Greenwood)",
    severity: "critical",
    status: "reported",
    reported_by_name: "Aarav Sharma",
    reported_by_phone: "+91 98765 43210",
    photo_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    assigned_crew: null,
    cleanup_proof_url: null,
    cleaned_at: null
  },
  {
    id: "dump-002",
    title: "Illegal Construction Debris & Broken Masonry",
    description: "Dumped overnight by private minitruck. Restricts rainwater drain flow and creates dust pollution.",
    latitude: 19.0820,
    longitude: 72.8830,
    address_landmark: "Corner of 5th Cross & Elm St Extension",
    ward_number: "Ward 14 (Greenwood)",
    severity: "medium",
    status: "assigned",
    reported_by_name: "Meera K.",
    reported_by_phone: "+91 98223 99881",
    photo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    assigned_crew: "Crew #3 (Heavy Loader)",
    cleanup_proof_url: null,
    cleaned_at: null
  },
  {
    id: "dump-003",
    title: "Culvert Waste Dump Cleared Successfully",
    description: "Accumulated dry waste and plastic bottles cleared by municipal sanitation team.",
    latitude: 19.0715,
    longitude: 72.8720,
    address_landmark: "Old Railway Culvert, South Greenwood",
    ward_number: "Ward 14 (Greenwood)",
    severity: "low",
    status: "cleaned",
    reported_by_name: "Sanjay Verma",
    reported_by_phone: "+91 98334 11223",
    photo_url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    assigned_crew: "Sanitation Rapid Crew #1",
    cleanup_proof_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    cleaned_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: "dump-004",
    title: "Vegetable Bazaar Organic Sludge Overflow",
    description: "Rotting vegetable leaves and rotten crates causing severe foul smell and flies.",
    latitude: 19.0880,
    longitude: 72.8790,
    address_landmark: "Backside of Wholesale Mandi, Gate 4",
    ward_number: "Ward 14 (Greenwood)",
    severity: "critical",
    status: "in_progress",
    reported_by_name: "Pooja Hegde",
    reported_by_phone: "+91 98450 66778",
    photo_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    assigned_crew: "Rajesh Kumar (Truck MH-12-GR-8890)",
    cleanup_proof_url: null,
    cleaned_at: null
  }
];

export const INITIAL_MISSING_BIN_REQUESTS = [
  {
    id: "bin-req-001",
    title: "Dual Segregated Dustbin Set at Greenwood Public Park",
    bin_type: "segregated_pair",
    description: "Park visitors and morning joggers generate significant beverage cartons and snack wrappers. Current small bin is constantly overflowing.",
    latitude: 19.0790,
    longitude: 72.8750,
    location_name: "Greenwood Central Park Gate 2 (Near Children's Play Area)",
    ward_number: "Ward 14 (Greenwood)",
    upvotes_count: 21,
    target_threshold: 25,
    status: "community_voting",
    created_by_name: "Aarav Sharma",
    upvoted_by: ["user-cit-01"],
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: "bin-req-002",
    title: "Heavy Commercial Dumpster for Morning Tea Stalls",
    bin_type: "heavy_commercial",
    description: "Cluster of 8 breakfast tea stalls create high paper cup and tea ground volume daily. Needs a 1100-liter wheeled container.",
    latitude: 19.0845,
    longitude: 72.8805,
    location_name: "Commercial Junction, Next to Sunrise Bakery",
    ward_number: "Ward 14 (Greenwood)",
    upvotes_count: 32,
    target_threshold: 25,
    status: "approved_for_installation",
    created_by_name: "Vikram Patil",
    upvoted_by: ["user-cit-01", "user-drv-01"],
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: "bin-req-003",
    title: "E-Waste & Battery Recycling Drop Box",
    bin_type: "e_waste",
    description: "No authorized place in 3km radius to safely dispose of alkaline batteries, old chargers, and broken bulb tubes.",
    latitude: 19.0730,
    longitude: 72.8795,
    location_name: "Ward 14 Community Library & Civic Center Entrance",
    ward_number: "Ward 14 (Greenwood)",
    upvotes_count: 14,
    target_threshold: 25,
    status: "community_voting",
    created_by_name: "Dr. Sunita Rao",
    upvoted_by: [],
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: "bin-req-004",
    title: "Organic Wet Waste Compost Hopper",
    bin_type: "organic_wet",
    description: "Promenade lined with coconut vendors. Having a dedicated husk and green waste bin will stop dumping on the grass.",
    latitude: 19.0690,
    longitude: 72.8680,
    location_name: "Riverfront Walkway, Gazebo Point 3",
    ward_number: "Ward 14 (Greenwood)",
    upvotes_count: 9,
    target_threshold: 25,
    status: "community_voting",
    created_by_name: "Anjali M.",
    upvoted_by: [],
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_DRIVER_ROUTE = [
  { id: "stop-1", street: "Central Market Boulevard", houses: 110, status: "completed", timestamp: "07:30 AM", lat: 19.0885, lng: 72.8795 },
  { id: "stop-2", street: "Oak Ridge Boulevard", houses: 85, status: "completed", timestamp: "08:45 AM", lat: 19.0765, lng: 72.8770 },
  { id: "stop-3", street: "Maple Grove Avenue", houses: 64, status: "completed", timestamp: "09:15 AM", lat: 19.0740, lng: 72.8745 },
  { id: "stop-4", street: "Cypress Crest Way", houses: 50, status: "completed", timestamp: "09:40 AM", lat: 19.0720, lng: 72.8730 },
  { id: "stop-5", street: "Silver Birch Road", houses: 38, status: "completed", timestamp: "10:05 AM", lat: 19.0705, lng: 72.8710 },
  { id: "stop-6", street: "Riverfront Walkway", houses: 55, status: "completed", timestamp: "10:30 AM", lat: 19.0685, lng: 72.8690 },
  { id: "stop-7", street: "Pinecrest Lane", houses: 42, status: "skipped", reason: "Compactor vehicle hydraulic issue", lat: 19.0805, lng: 72.8810 },
  { id: "stop-8", street: "Elm Street Extension", houses: 72, status: "pending", lat: 19.0830, lng: 72.8835 },
  { id: "stop-9", street: "Lotus Valley Lane", houses: 90, status: "pending", lat: 19.0860, lng: 72.8860 }
];
