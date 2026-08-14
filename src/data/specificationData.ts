export interface SpecSection {
  id: string;
  title: string;
  badge?: string;
  summary: string;
  content: {
    heading?: string;
    description?: string;
    bullets?: string[];
    table?: { headers: string[]; rows: string[][] };
    codeSnippet?: string;
    architectureDiagram?: string[];
  }[];
}

export const PRODUCT_SPECIFICATION: SpecSection[] = [
  {
    id: 'executive-summary',
    title: '1. Executive Summary',
    badge: 'Overview',
    summary: 'Strategic overview of "Drive Green, Share Smart" - Singapore’s premier 100% Electric Vehicle (EV) carsharing and on-demand mobility platform.',
    content: [
      {
        heading: 'Vision & Mission',
        description: '"Drive Green, Share Smart" is conceived to accelerate Singapore’s Green Plan 2030 by eliminating private car ownership friction and replacing fossil-fuel rental fleets with a high-utilization, 100% electric shared ecosystem. By combining zero-emission vehicles (BYD Atto 3, Hyundai IONIQ 5, Kona EV, commercial electric vans) with intelligent booking, smart charging integrations (SP Mobility, Charge+, Shell Recharge), and real-time carbon telemetry, the platform offers an affordable, sustainable alternative to GetGo, Tribecar, and BlueSG.'
      },
      {
        heading: 'Strategic Highlights',
        bullets: [
          '100% Zero-Tailpipe Emission Fleet: Pure BEV catalog spanning SUVs, MPVs, and commercial delivery vans.',
          'Key Singapore Partnerships: EV OEMs (BYD, Hyundai), Charging CPOs (SP Mobility, Charge+, Shell Recharge), and HDB/commercial landlords.',
          'Smart Automated Telematics: In-vehicle IoT gateway for keyless Bluetooth BLE unlock, real-time State-of-Charge (SoC) management, and automated mileage billing.',
          'Gamified Green Rewards: "EcoPoints" and Singapore Green Plan certified CO2 offsets for both B2C consumers and B2B ESG corporate accounts.'
        ]
      }
    ]
  },
  {
    id: 'business-problem',
    title: '2. Business Problem',
    badge: 'Market Need',
    summary: 'The critical economic, environmental, and consumer friction points in Singapore’s carsharing and mobility landscape.',
    content: [
      {
        heading: 'Current Market Pain Points',
        table: {
          headers: ['Market Challenge', 'Impact on Consumers & Operators', 'Drive Green Solution'],
          rows: [
            ['High ICE Petrol Costs & Volatility', 'Users face fluctuating fuel surcharges and dirty fueling stops.', 'Fixed low mileage rates ($0.35-$0.42/km) with free partner DC charging.'],
            ['Mixed/Dirty Competitor Fleets', 'GetGo & Tribecar fleets are predominantly fossil-fuel ICE vehicles.', '100% pure electric fleet with verified carbon savings certificates.'],
            ['Range Anxiety & Charging Friction', 'Users fear battery depletion or slow charger availability.', 'Real-time SoC tracking, minimum 70% range booking guarantee, and CPO API sync.'],
            ['Prohibitive Car Ownership Costs', 'Singapore COE (Certificate of Entitlement) exceeds $100k SGD.', 'Instant hourly/daily access with $0 downpayment, road tax, or maintenance liability.']
          ]
        }
      }
    ]
  },
  {
    id: 'solution-overview',
    title: '3. Solution Overview',
    badge: 'Value Proposition',
    summary: 'The unified three-pillar ecosystem: Consumer Mobile App, Smart Fleet Telematics Engine, and Enterprise ESG Dashboard.',
    content: [
      {
        heading: 'Core Solution Architecture',
        bullets: [
          'Customer Mobile & Web Portal: Single-screen fast search, vehicle reserve with 15-minute hold, Bluetooth smart unlock, in-trip charging route planner, and instant trip summaries.',
          'Intelligent Fleet Optimization Engine: Algorithmic vehicle rebalancing, low-battery automated dispatch to CPO fast chargers, dynamic off-peak/peak pricing, and predictive maintenance.',
          'Sustainability & Corporate ESG Portal: Verified ISO-standard CO2 offset reporting for corporate clients, university student discount programs, and community eco-leaderboards.'
        ]
      }
    ]
  },
  {
    id: 'user-personas',
    title: '4. User Personas',
    badge: 'Target Audience',
    summary: 'Deep behavioral archetypes of Singapore drivers adopting electric carsharing.',
    content: [
      {
        heading: 'Primary & Secondary Segments',
        table: {
          headers: ['Persona', 'Profile & Motivation', 'Key Needs & Feature Fit'],
          rows: [
            ['Eco-Conscious Urbanite (Marcus, 28)', 'Tech professional living in CBD; values carbon footprint reduction.', 'Wants sleek Hyundai IONIQ 5 for weekend getaways; values verified CO2 metrics.'],
            ['University Student (Chloe, 22)', 'NUS student needing occasional wheels for group projects and outings.', 'Requires affordable off-peak student rates, Singpass quick verification, and zero deposit.'],
            ['SME Logistics Operator (Uncle Tan, 45)', 'Florist/E-commerce SME owner in Ubi needing cargo space.', 'Commercial electric vans (DFSK EC35, Shineray X30LEV) with high volume and commercial daily passes.'],
            ['Corporate ESG Manager (Seraphina, 38)', 'Sustainability director at multinational firm reporting Scope 3 emissions.', 'B2B billing portal, multi-driver corporate pass, and monthly carbon reduction audit statements.']
          ]
        }
      }
    ]
  },
  {
    id: 'core-features',
    title: '5. Core Features',
    badge: 'Functional Scope',
    summary: 'Feature matrix spanning discovery, vehicle booking, telematics control, and billing.',
    content: [
      {
        heading: 'Feature Breakdown Matrix',
        bullets: [
          'Instant Map & List Search: Filter by EV category (Select, Plus, Commercial), seating (2 to 7 seats), battery SoC %, and charging speed.',
          'Transparent Dynamic Rates: Clear distinction between off-peak ($6.00-$9.80/hr), peak ($9.00-$14.50/hr), day passes, and mileage tariffs.',
          'Keyless Digital Bluetooth BLE Access: Unlock/lock vehicle doors, trigger hazard lights for easy localization, and immobilizer control via phone.',
          'Integrated EV Charging Guide: Embedded Singapore map with SP Mobility, Charge+, Shell Recharge, and CDG ENGIE charger live status and payment QR.',
          'Clean Co-Driver & Singpass Verification: 30-second automated onboarding via Singpass MyInfo API for driving license validation.',
          'Green Miles Loyalty Program: Earn EcoPoints per kg of CO2 saved, redeemable for rental credits or tree planting donations.'
        ]
      }
    ]
  },
  {
    id: 'user-flow',
    title: '6. User Flow',
    badge: 'UX Journey',
    summary: 'End-to-end friction-free journey from vehicle search to post-trip carbon certificate.',
    content: [
      {
        heading: 'Step-by-Step User Journey',
        bullets: [
          '1. Discovery: User enters Singapore location (e.g., "Marina Bay" or "Tampines") or selects vehicle category filter.',
          '2. Vehicle Inspection: Views real-time battery SoC %, available range (km), vehicle specs, pricing breakdown, and exact lot location.',
          '3. Instant Booking: Selects start/end duration, chooses CDW excess protection, verifies license via Singpass, and secures booking with PayNow/Card.',
          '4. Vehicle Pickup & Pre-Trip Inspection: Walks to dedicated EV lot, completes 4-point exterior photo check in app, and clicks "Unlock Car".',
          '5. Drive & Smart Charging: Enjoy silent electric acceleration. If low on battery, in-app map directs to nearest SP Mobility/Charge+ charger (free of charge).',
          '6. Return & Auto-Settlement: Parks at original designated lot, plugs in charger (earns +50 bonus EcoPoints), clicks "End Trip", and receives instant CO2 savings statement.'
        ]
      }
    ]
  },
  {
    id: 'technical-architecture',
    title: '7. Technical Architecture',
    badge: 'System Design',
    summary: 'Cloud-native, microservices-driven architecture hosted on AWS/Azure with high availability and edge telematics.',
    content: [
      {
        heading: 'Microservices & Infrastructure Diagram',
        architectureDiagram: [
          '[ Client Tier: React / Next.js Web + React Native Mobile Apps ]',
          '         │ (HTTPS / WSS / gRPC)',
          '         ▼',
          '[ API Gateway: Kong / Envoy with Rate Limiting & Auth JWT ]',
          '    ├── [ Auth Service: Singpass MyInfo + Firebase / Auth0 ]',
          '    ├── [ Booking & Pricing Engine: Dynamic Tariff & Reservation Locks ]',
          '    ├── [ Fleet Telematics Service: MQTT / AWS IoT Core to Vehicle CAN-bus ]',
          '    ├── [ CPO Charging Proxy: SP Mobility / Charge+ / Shell API Connectors ]',
          '    ├── [ Billing & Payments: Stripe + PayNow Gateway + EcoPoints Ledger ]',
          '    └── [ Sustainability Analytics: Kafka Stream -> PostgreSQL / ClickHouse ]'
        ]
      }
    ]
  },
  {
    id: 'database-design',
    title: '8. Database Design',
    badge: 'PostgreSQL Schema',
    summary: 'Relational schema optimized for spatial queries (PostGIS), transactional reservations, and immutable trip audit trails.',
    content: [
      {
        heading: 'Core Relational Schema DDL',
        codeSnippet: `-- Schema: Drive Green, Share Smart (PostgreSQL 16 + PostGIS)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    singpass_nric_hash VARCHAR(64) UNIQUE,
    license_number VARCHAR(64) NOT NULL,
    license_verified_at TIMESTAMPTZ,
    membership_tier VARCHAR(32) DEFAULT 'Eco Bronze',
    eco_points_balance INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number VARCHAR(16) UNIQUE NOT NULL,
    make VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL, -- 'SUV', 'Van', 'Sedan', 'MPV'
    category VARCHAR(32) NOT NULL,     -- 'Select Electric', 'Plus Electric', etc.
    battery_capacity_kwh NUMERIC(5,2) NOT NULL,
    current_soc_percent INT NOT NULL CHECK (current_soc_percent BETWEEN 0 AND 100),
    max_range_km INT NOT NULL,
    current_location_geom GEOMETRY(Point, 4326),
    assigned_station_id UUID REFERENCES charging_stations(id),
    status VARCHAR(32) DEFAULT 'available', -- 'available', 'reserved', 'in_trip', 'maintenance'
    hourly_rate_offpeak NUMERIC(6,2) NOT NULL,
    hourly_rate_peak NUMERIC(6,2) NOT NULL,
    mileage_rate_per_km NUMERIC(5,2) NOT NULL
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    start_odometer_km NUMERIC(8,2),
    end_odometer_km NUMERIC(8,2),
    total_km_driven NUMERIC(8,2),
    base_cost NUMERIC(8,2) NOT NULL,
    mileage_cost NUMERIC(8,2) DEFAULT 0,
    co2_saved_kg NUMERIC(6,3) DEFAULT 0,
    booking_status VARCHAR(32) DEFAULT 'confirmed',
    payment_status VARCHAR(32) DEFAULT 'pending'
);`
      }
    ]
  },
  {
    id: 'api-design',
    title: '9. API Design',
    badge: 'REST & WebSockets',
    summary: 'OpenAPI 3.0 specification for vehicle discovery, remote telematics commands, and trip completion.',
    content: [
      {
        heading: 'Key REST API Endpoints',
        table: {
          headers: ['Method & Endpoint', 'Payload / Params', 'Description'],
          rows: [
            ['GET /api/v1/vehicles', 'lat, lng, radius_km, category, min_soc', 'Returns nearby available electric vehicles with real-time SoC & rates.'],
            ['POST /api/v1/bookings/reserve', '{ vehicle_id, start_time, end_time, cdw }', 'Creates reservation lock (15-minute grace window).'],
            ['POST /api/v1/telematics/unlock', '{ booking_id, bluetooth_token }', 'Sends secure cryptographic unlock pulse to vehicle IoT gateway.'],
            ['GET /api/v1/charging/stations', 'lat, lng, operator', 'Fetches live charger availability from SP Mobility / Charge+ APIs.'],
            ['POST /api/v1/bookings/return', '{ booking_id, photo_urls, plugged_in }', 'Finalizes trip, reads CAN-bus odometer, credits eco points, and charges card.']
          ]
        }
      }
    ]
  },
  {
    id: 'admin-dashboard',
    title: '10. Admin Dashboard & Fleet Management',
    badge: 'Operations',
    summary: 'Internal control center for real-time fleet operations, battery telemetry, maintenance dispatch, and dynamic pricing.',
    content: [
      {
        heading: 'Key Admin Capabilities',
        bullets: [
          'Live Singapore Telematics Map: Real-time GPS tracking, battery voltage, temperature, and door lock states for all fleet units.',
          'Smart Rebalancing & Charging Alerts: Automated tasks dispatched to operations runners when vehicle SoC drops below 30%.',
          'Dynamic Yield Management: Adjust peak/off-peak pricing thresholds dynamically based on MRT peak hours and weather events.',
          'Customer Verification Queue: Exception monitoring for manual Singpass and international driver verification.'
        ]
      }
    ]
  },
  {
    id: 'sustainability-features',
    title: '11. Sustainability & Carbon Accounting',
    badge: 'Green Core',
    summary: 'Verifiable green mechanics powering the "Drive Green, Share Smart" brand differentiator.',
    content: [
      {
        heading: 'Carbon Methodology & Calculation Model',
        bullets: [
          'Baseline Comparison: Traditional ICE fleet in Singapore emits ~0.210 kg CO2e / km. EV powered by Singapore grid mix emits ~0.038 kg CO2e / km.',
          'Net Reduction: 0.172 kg CO2 avoided per kilometer driven.',
          'Gamified Rewards: 10 EcoPoints awarded per kg of CO2 saved. Bonus 50 EcoPoints for returning vehicle plugged into a fast charger.',
          'ESG Corporate Certificates: Automated downloadable quarterly audit reports for enterprise clients seeking ISO 14064 greenhouse gas compliance.'
        ]
      }
    ]
  },
  {
    id: 'kpis',
    title: '12. Key Performance Indicators (KPIs)',
    badge: 'Metrics',
    summary: 'Dual-track operational and environmental success metrics.',
    content: [
      {
        heading: 'Target Performance Metrics',
        table: {
          headers: ['Metric Category', 'Target KPI (Year 1)', 'Measurement Cadence'],
          rows: [
            ['Fleet Utilization Rate', '> 68% average daily utilization', 'Real-time telemetry / Weekly average'],
            ['CO2 Emissions Avoided', '> 1,200 Metric Tonnes CO2', 'Cumulative continuous audit'],
            ['Average Booking Duration', '3.4 hours / booking', 'Monthly analytics'],
            ['App Store / CSAT Rating', '> 4.8 / 5.0 rating', 'Continuous user feedback'],
            ['Charging Turnaround Time', '< 45 minutes DC fast charge', 'CPO telematics sync']
          ]
        }
      }
    ]
  },
  {
    id: 'implementation-roadmap',
    title: '13. Implementation Roadmap',
    badge: 'Execution',
    summary: 'Phased rollout plan spanning MVP launch to islandwide autonomous hub scaling.',
    content: [
      {
        heading: 'Phases & Milestones',
        table: {
          headers: ['Phase', 'Timeline', 'Deliverables'],
          rows: [
            ['Phase 1: Foundation & MVP', 'Months 1 - 3', 'Web catalog, Singpass integration, 50 BYD Atto 3 & Hyundai Kona EVs, SP Mobility charging integration.'],
            ['Phase 2: Fleet Expansion & Commercial', 'Months 4 - 6', 'Rollout of Shineray & DFSK electric vans, B2B corporate billing portal, dynamic peak pricing engine.'],
            ['Phase 3: Smart Charging & V2G Pilot', 'Months 7 - 9', 'Smart off-peak grid charging, Charge+ deep integration, automated runner dispatch app.'],
            ['Phase 4: Islandwide Scale', 'Months 10 - 12', '500+ EV fleet, Singapore Green Plan carbon credit trading integration, corporate ESG tier expansion.']
          ]
        }
      }
    ]
  }
];
