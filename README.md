# 🗑️ Civic-Bin Tracker | Smart Urban Waste Management & Geo-Reporting

> An ultra-sleek, engaging civic-tech web & mobile application designed to solve local waste management and irregular garbage collection issues through citizen participation, crew route tracking, and municipal accountability.

---

## 🌟 Core Highlights & Features

### 1. 🔐 Authentication & Access Control
- **Mandatory Mobile Number Login**: Authenticate citizens, sanitation crew members, and municipal ward authorities via phone number and 6-digit OTP verification.
- **Instant Role-Based Routing**:
  - 🏠 **Citizen Dashboard**: Household collection status, quick dump snap, petition missing bins, and track active collection compactor trucks.
  - 🚛 **Truck Driver / Sanitation Crew Dashboard**: Morning route stop checklist, record collected vs. skipped streets with incident reasons, view assigned open dump spots, and upload clearance proof.
  - 🏛️ **Municipal Authority / Admin Dashboard**: Ward-level collection pulse (% serviced vs. skipped), rapid crew triage for open dumping hot spots, and dustbin tender approvals.
- **One-Click Demo Profiles**: Test effortlessly as *Aarav Sharma (Citizen)*, *Rajesh Kumar (Truck Driver #4)*, or *Dr. Sunita Rao (Ward Authority)*.

---

### 2. ⚡ Core Feature: Daily Collection Status ("Collected vs. Not Collected")
- **Prominent Status Hub**: Highly visible toggle on the home screen allowing citizens to mark their house/street status for the day:
  - 🟢 **"Collected"**: Vibrant emerald green badge with check icon, timestamps, and rewarding confetti.
  - 🟠 **"Not Collected"**: Warning amber alert badge prompting for root cause (e.g. *Truck didn't arrive*, *Arrived before 07:00 AM*, *Road blocked*, *Refused unsegregated waste*).
- **Neighborhood Real-Time Aggregation**:
  - Live percentage of serviced vs. skipped streets in the neighborhood (e.g., `78% Serviced | 22% Skipped`).
  - Total households serviced tally (`352 / 460 Homes`).
  - Street-by-street audit directory with last collection timestamps and driver notes.

---

### 3. 🔥 Open Dumping Heat Map & GPS Reporting
- **Geo-Tagged Reporting**: Citizens take or upload photographic evidence of open dump sites and garbage spills.
- **Automatic GPS Capture**: Browser Geolocation API captures exact latitude & longitude with interactive pin mapping and timestamping.
- **Interactive Heatmap View**:
  - Built with Leaflet.js with custom dark/light tiles.
  - Hotspot accumulation radar circles (`L.circle`) and custom pulsing SVG pins (Critical Red, Medium Amber, Cleaned Emerald).
  - Before & After photo verification proofs.

---

### 4. 📍 Infrastructure Request Module ("Missing Bin Locator")
- **Pin Drop Community Petition**: Drop a location pin to petition for public bins in underserved zones.
- **Bin Types**: Dual Segregated Wet/Dry Pair, 1100L Heavy Wheeled Dumpster, Organic Compost Hopper, Dry Plastic Recovery, and E-Waste Drop Box.
- **Community Upvoting & Threshold**:
  - Real-time progress bar towards the **25 upvote threshold**.
  - Automatic status escalation to *"Municipal Approved for Installation"* when the community threshold is reached.

---

### 5. 🛠️ Tech Stack & Database Setup
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Maps**: Leaflet.js with OpenStreetMap / Carto tiles and custom SVG pins.
- **Backend & Auth**: Supabase ready (`supabase_schema.sql` included with full RLS policies) + robust reactive local-first fallback with zero configuration needed to run out of the box.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

App will be available at: **`http://localhost:3000`**

---

## 🗄️ Supabase Cloud Configuration (Optional)
Run the queries from [`supabase_schema.sql`](file:///c:/Users/shiva/OneDrive/Desktop/bint/supabase_schema.sql) in your Supabase SQL Editor. Then click the **Database icon** in the top navigation bar to save your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
