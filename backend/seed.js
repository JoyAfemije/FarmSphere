/**
 * FarmSphere Seed Script — International Product Catalogue
 * Populates the database with 40+ realistic global agricultural products in USD.
 *
 * Run:  node seed.js
 *
 * Product data is modelled after real offerings from global brands:
 * Syngenta · BASF · Bayer CropScience · Corteva · Yara · Netafim · John Deere
 * Prices are in USD and converted to minor-unit cents in the DB (stored as whole $).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

/* ─── Categories ──────────────────────────────────────────────────── */
const categories = [
  { name: "Tools & Equipment", icon: "🔧", description: "Power tools, hand tools, and farm machinery for modern farming worldwide", order: 1 },
  { name: "Fertilizers",       icon: "🌱", description: "NPK, organic, urea, and specialty fertilizers for maximum crop yield",  order: 2 },
  { name: "Pesticides",        icon: "🛡️", description: "Insecticides, herbicides, and fungicides for global crop protection",   order: 3 },
  { name: "Irrigation",        icon: "💧", description: "Drip irrigation, sprinkler systems, and water management equipment",    order: 4 },
  { name: "Chemicals",         icon: "🧪", description: "Soil enhancers, growth regulators, and specialty agri-chemicals",      order: 5 },
  { name: "Seeds",             icon: "🌾", description: "Hybrid, open-pollinated, and certified seeds for all crops",           order: 6 },
  { name: "Farm Accessories",  icon: "🏡", description: "Protective gear, storage solutions, and general farm accessories",     order: 7 },
  { name: "Livestock Supplies",icon: "🐄", description: "Animal feed, health products, and livestock housing equipment",        order: 8 },
];

/* ─── Unsplash image pool by category ────────────────────────────── */
const IMGS = {
  fertilizer: [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  ],
  pesticide: [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=600&q=80",
  ],
  tools: [
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  ],
  irrigation: [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80",
  ],
  seeds: [
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=80",
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80",
  ],
  livestock: [
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80",
    "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80",
  ],
};

const img = (type, idx = 0) => [{ url: IMGS[type][idx % IMGS[type].length], alt: `${type} product` }];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);
    console.log("🗑️  Cleared existing data");

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    const c = {};
    createdCategories.forEach((cat) => { c[cat.name] = cat._id; });

    /* ─── Products ─────────────────────────────────────────────────── */
    const products = [

      /* ══════════════ FERTILIZERS ══════════════ */
      {
        name: "Yara Mila Actyva NPK 12-11-18 (25 kg)",
        shortDescription: "Balanced NPK for cereals, vegetables, and root crops",
        description: "Yara Mila Actyva is a world-class nitrogen-phosphorus-potassium fertilizer designed for broad-acre crops. The 12-11-18 ratio ensures balanced nutrition across growth stages. Enhanced with sulphur and magnesium for micronutrient support. Manufactured by Yara International (Norway) — the global leader in crop nutrition. Suitable for wheat, barley, maize, potato, and sugar beet.",
        price: 32, discountPrice: 27,
        category: c["Fertilizers"], stock: 600, unit: "bag", brand: "Yara International",
        isFeatured: true,
        tags: ["NPK", "fertilizer", "cereals", "vegetables", "Yara"],
        specifications: [
          { key: "N:P:K Ratio", value: "12:11:18" },
          { key: "Weight", value: "25 kg" },
          { key: "Form", value: "Granular" },
          { key: "Origin", value: "Norway" },
          { key: "Sulphur Content", value: "8%" },
          { key: "Magnesium", value: "3%" },
        ],
        images: img("fertilizer", 0),
      },
      {
        name: "ICL Polysulphate Fertilizer (25 kg)",
        shortDescription: "Multi-nutrient fertilizer with sulphur, calcium & magnesium",
        description: "Polysulphate is a unique, certified organic-input fertilizer mined from polyhalite deposits in the UK. Provides four nutrients — sulphur (48%), potassium (14%), magnesium (6%), and calcium (17%) — in a single granule with a slow-release profile. Ideal for oilseed rape, potatoes, cereals, and legumes. Low chloride content suitable for sensitive crops.",
        price: 29, discountPrice: null,
        category: c["Fertilizers"], stock: 400, unit: "bag", brand: "ICL Specialty Fertilizers",
        isFeatured: false,
        tags: ["polysulphate", "sulphur", "potassium", "organic input"],
        specifications: [
          { key: "Sulphur", value: "48%" }, { key: "Potassium (K₂O)", value: "14%" },
          { key: "Magnesium (MgO)", value: "6%" }, { key: "Calcium (CaO)", value: "17%" },
          { key: "Origin", value: "United Kingdom" }, { key: "Form", value: "Granular" },
        ],
        images: img("fertilizer", 1),
      },
      {
        name: "Nutrien Urea Fertilizer 46-0-0 (50 kg)",
        shortDescription: "High-nitrogen urea for rice, maize, and leafy crops — top-dressing",
        description: "Nutrien's premium granular urea with 46% nitrogen — the highest nitrogen concentration of any dry fertiliser. Prilled for uniform spreading. Rapidly converts to ammonium and nitrate in warm, moist soils for fast plant uptake. Widely used across North America, Asia, and Africa for top-dressing cereal crops. Also suitable for foliar application at 0.5–2% solution.",
        price: 22, discountPrice: 19,
        category: c["Fertilizers"], stock: 800, unit: "bag", brand: "Nutrien",
        isFeatured: true,
        tags: ["urea", "nitrogen", "rice", "maize", "top-dressing"],
        specifications: [
          { key: "Nitrogen Content", value: "46%" }, { key: "Weight", value: "50 kg" },
          { key: "Form", value: "Prilled granular" }, { key: "Origin", value: "Canada" },
          { key: "Application", value: "Broadcast top-dressing or incorporation" },
        ],
        images: img("fertilizer", 0),
      },
      {
        name: "Haifa Poly-Feed Foliar 20-20-20 (5 kg)",
        shortDescription: "Fully water-soluble NPK for fertigation and foliar feeding",
        description: "Haifa Poly-Feed 20-20-20 is a fully soluble, chloride-free NPK fertilizer perfect for drip irrigation (fertigation) and foliar spray. Contains equal proportions of N, P, and K with trace elements. Rapidly absorbed by leaves and roots. Boosts vegetative growth, flowering, and fruit set. Widely used on tomatoes, peppers, strawberries, and greenhouse crops.",
        price: 18, discountPrice: 15,
        category: c["Fertilizers"], stock: 350, unit: "bag", brand: "Haifa Group",
        isFeatured: false,
        tags: ["water soluble", "fertigation", "foliar", "NPK", "greenhouse"],
        images: img("fertilizer", 1),
      },
      {
        name: "Compo Expert Basacote Plus 9M (25 kg)",
        shortDescription: "Controlled-release fertilizer — feeds crops for 9 months",
        description: "Basacote Plus is a coated, controlled-release NPK fertilizer from COMPO EXPERT (Germany). A single application releases nutrients steadily for up to 9 months, eliminating leaching and reducing application labour. NPK 13-6-16 + MgO + trace elements. Ideal for nurseries, orchards, perennial crops, and high-value vegetable production.",
        price: 55, discountPrice: 48,
        category: c["Fertilizers"], stock: 200, unit: "bag", brand: "COMPO EXPERT",
        isFeatured: false,
        tags: ["controlled release", "slow release", "orchard", "nursery", "Germany"],
        images: img("fertilizer", 0),
      },

      /* ══════════════ PESTICIDES ══════════════ */
      {
        name: "Syngenta Karate Zeon 5% CS Insecticide (1 L)",
        shortDescription: "Lambda-cyhalothrin — fast knockdown on 200+ insect pests",
        description: "Karate Zeon uses capsule suspension (CS) micro-encapsulation technology to deliver lambda-cyhalothrin with maximum efficacy and reduced odour. Controls aphids, thrips, caterpillars, beetles, mites, and soil insects. Registered for use on cereals, maize, soybean, cotton, vegetables, and fruit crops. Pre-harvest interval: 7 days on vegetables. Widely used across 100+ countries.",
        price: 28, discountPrice: 23,
        category: c["Pesticides"], stock: 350, unit: "litre", brand: "Syngenta",
        isFeatured: true,
        tags: ["insecticide", "lambda-cyhalothrin", "Karate", "Syngenta", "pyrethroid"],
        specifications: [
          { key: "Active Ingredient", value: "Lambda-cyhalothrin 5%" },
          { key: "Formulation", value: "Capsule Suspension (CS)" },
          { key: "Mode of Action", value: "Sodium channel disruptor (Group 3A)" },
          { key: "Spectrum", value: "Broad-spectrum contact & stomach" },
          { key: "PHI Vegetables", value: "7 days" },
        ],
        images: img("pesticide", 0),
      },
      {
        name: "BASF Headline EC Fungicide (1 L)",
        shortDescription: "Pyraclostrobin fungicide for disease control & yield protection",
        description: "Headline EC (pyraclostrobin 250 g/L) from BASF is a strobilurin fungicide that controls a wide spectrum of fungal diseases in cereals, oilseed rape, and corn. Provides preventive, curative, and eradicant activity. Also activates the plant's own defence mechanisms (Plant Health Effect), leading to greener, longer-lasting canopy and improved yield. Registered globally in 100+ crops.",
        price: 45, discountPrice: 39,
        category: c["Pesticides"], stock: 200, unit: "litre", brand: "BASF",
        isFeatured: true,
        tags: ["fungicide", "pyraclostrobin", "strobilurin", "BASF", "disease control"],
        specifications: [
          { key: "Active Ingredient", value: "Pyraclostrobin 250 g/L" },
          { key: "Formulation", value: "Emulsifiable Concentrate (EC)" },
          { key: "Mode of Action", value: "QoI inhibitor (Group 11)" },
          { key: "Crops", value: "Cereals, Maize, Oilseed Rape" },
        ],
        images: img("pesticide", 1),
      },
      {
        name: "Bayer Roundup PowerMax Herbicide (5 L)",
        shortDescription: "Glyphosate 540 g/L — premium broad-spectrum weed killer",
        description: "Roundup PowerMax is Bayer's highest-concentration glyphosate formulation at 540 g/L. Non-selective, post-emergence, systemic herbicide that controls annual and perennial weeds. Translocation to roots ensures complete kill. Preferred for stubble management, fallow weed control, and pre-plant burndown. Biodegradable. Approved for over 100 crops worldwide.",
        price: 38, discountPrice: 33,
        category: c["Pesticides"], stock: 300, unit: "litre", brand: "Bayer CropScience",
        isFeatured: false,
        tags: ["herbicide", "glyphosate", "Roundup", "Bayer", "weed control"],
        specifications: [
          { key: "Active Ingredient", value: "Glyphosate 540 g/L" },
          { key: "Mode of Action", value: "EPSP synthase inhibitor (Group 9)" },
          { key: "Application Rate", value: "1.2–3.0 L/ha" },
          { key: "Selectivity", value: "Non-selective" },
        ],
        images: img("pesticide", 0),
      },
      {
        name: "Corteva Amistar Top Fungicide (500 ml)",
        shortDescription: "Azoxystrobin + difenoconazole dual-action fungicide",
        description: "Amistar Top combines two fungicide actives — azoxystrobin (strobilurin) and difenoconazole (triazole) — for protectant and curative disease control. Highly effective against Septoria, Fusarium head blight, powdery mildew, and rust in cereals. Also registered for use in grapes, bananas, rice, and vegetables. Provides both plant health and yield protection benefits.",
        price: 52, discountPrice: 46,
        category: c["Pesticides"], stock: 180, unit: "litre", brand: "Corteva Agriscience",
        isFeatured: false,
        tags: ["fungicide", "azoxystrobin", "difenoconazole", "cereals", "dual action"],
        images: img("pesticide", 1),
      },

      /* ══════════════ TOOLS & EQUIPMENT ══════════════ */
      {
        name: "Honda WB20XT3 2-Inch Water Pump",
        shortDescription: "2\" petrol water pump — 600 litres/min for irrigation & drainage",
        description: "The Honda WB20XT3 delivers 600 litres/minute with its reliable Honda GX120 4-stroke engine. Ideal for field irrigation, drainage, pond filling, and emergency flood control. Self-priming with a 7-metre suction lift. Compact, lightweight, and fuel-efficient. Trusted by farmers on every continent. 2-year Honda warranty included.",
        price: 385, discountPrice: 340,
        category: c["Tools & Equipment"], stock: 40, unit: "piece", brand: "Honda Power Equipment",
        isFeatured: true,
        tags: ["water pump", "Honda", "irrigation pump", "drainage", "petrol pump"],
        specifications: [
          { key: "Engine", value: "Honda GX120 4-stroke OHV" },
          { key: "Max Flow", value: "600 L/min" },
          { key: "Max Head", value: "28 metres" },
          { key: "Suction Lift", value: "7 metres" },
          { key: "Outlet Diameter", value: "2 inches (50mm)" },
          { key: "Weight", value: "24 kg" },
          { key: "Warranty", value: "2 years" },
        ],
        images: img("tools", 0),
      },
      {
        name: "Kubota RT Series Mini Power Tiller (5 HP)",
        shortDescription: "Fuel-efficient mini tractor for paddy, vegetable & market gardens",
        description: "The Kubota RT series mini tiller is Asia's most popular farm tool for small-scale intensive farming. The 5HP diesel engine delivers excellent fuel economy — just 0.5L/hr. Tills 20–25cm deep and 30–60cm wide. Ideal for paddy fields, vegetable plots, and greenhouse beds. Includes floats, ridgers, and standard blades. Quiet, low-vibration operation. Available in 100+ countries.",
        price: 680, discountPrice: 590,
        category: c["Tools & Equipment"], stock: 20, unit: "piece", brand: "Kubota",
        isFeatured: true,
        tags: ["power tiller", "Kubota", "mini tractor", "paddy", "diesel"],
        specifications: [
          { key: "Engine", value: "Kubota 5HP diesel" },
          { key: "Fuel Consumption", value: "0.5 L/hr" },
          { key: "Tilling Width", value: "30–60 cm (adjustable)" },
          { key: "Tilling Depth", value: "20–25 cm" },
          { key: "Transmission", value: "3 forward + 1 reverse" },
          { key: "Weight", value: "105 kg" },
        ],
        images: img("tools", 1),
      },
      {
        name: "SOLO 425 Professional Knapsack Sprayer (15 L)",
        shortDescription: "German-engineered pressure sprayer — perfect for farms & orchards",
        description: "The SOLO 425 is the gold standard in professional knapsack sprayers, manufactured in Germany since 1948. The piston pump delivers constant pressure up to 3 bar for fine, uniform mist. 15-litre tank with wide-mouth opening for easy filling. Lance rotates 360° with 4-nozzle set (hollow cone, flat fan, adjustable). Anti-drip valve. Used by professional farmers in 150+ countries.",
        price: 78, discountPrice: 65,
        category: c["Tools & Equipment"], stock: 150, unit: "piece", brand: "SOLO Sprayers",
        isFeatured: true,
        tags: ["knapsack sprayer", "SOLO", "professional", "German", "piston pump"],
        specifications: [
          { key: "Tank Capacity", value: "15 litres" },
          { key: "Pump Type", value: "Single-action piston" },
          { key: "Max Pressure", value: "3 bar (45 psi)" },
          { key: "Nozzles Included", value: "4 (hollow cone, flat fan, adjustable jet)" },
          { key: "Origin", value: "Germany" },
          { key: "Weight (empty)", value: "3.5 kg" },
        ],
        images: img("tools", 2),
      },
      {
        name: "John Deere 5E Series 75HP Tractor (2WD)",
        shortDescription: "Workhorse utility tractor for mid-size farms — ploughing & transport",
        description: "The John Deere 5E Series 75HP tractor is built for real-world farming across multiple terrain types. Features PowerTech Plus 4-cylinder diesel engine, 8F/8R PowrReverser transmission, and Category II 3-point hitch. Compatible with a wide range of implements: ploughs, disc harrows, seeders, sprayers. HVAC cab optional. Supported by John Deere's global dealer network in 130+ countries.",
        price: 28500, discountPrice: 26800,
        category: c["Tools & Equipment"], stock: 5, unit: "piece", brand: "John Deere",
        isFeatured: true,
        tags: ["tractor", "John Deere", "75HP", "utility tractor", "ploughing"],
        specifications: [
          { key: "Engine Power", value: "75 HP (56 kW)" },
          { key: "Engine", value: "4-cylinder PowerTech Plus diesel" },
          { key: "Transmission", value: "8F/8R PowrReverser" },
          { key: "Hitch", value: "Category II 3-point" },
          { key: "PTO", value: "540/1000 rpm" },
          { key: "Fuel Tank", value: "100 litres" },
        ],
        images: img("tools", 0),
      },
      {
        name: "Husqvarna 555 Professional Chainsaw",
        shortDescription: "Professional-grade chainsaw for land clearing and orchard work",
        description: "The Husqvarna 555 is a high-performance, professional chainsaw designed for demanding land clearing, logging, and orchard maintenance. 59.8cc engine with X-Torq technology for 20% lower fuel consumption and 75% lower emissions. Smart Start for easy cold starts. Low-vibration anti-vibe system for comfortable all-day use. Suitable for clearing farmland, pruning, and timber work.",
        price: 490, discountPrice: 425,
        category: c["Tools & Equipment"], stock: 18, unit: "piece", brand: "Husqvarna",
        isFeatured: false,
        tags: ["chainsaw", "Husqvarna", "land clearing", "logging", "professional"],
        specifications: [
          { key: "Engine Displacement", value: "59.8 cc" },
          { key: "Power Output", value: "3.5 kW (4.7 hp)" },
          { key: "Bar Length", value: "15–20 inches" },
          { key: "Weight", value: "6.0 kg (without bar)" },
          { key: "Fuel Consumption", value: "395 g/kWh" },
          { key: "Origin", value: "Sweden" },
        ],
        images: img("tools", 1),
      },

      /* ══════════════ IRRIGATION ══════════════ */
      {
        name: "Netafim Streamline XR Drip Tape Kit (1 Acre)",
        shortDescription: "Israel's top drip irrigation tape system for row crops",
        description: "Netafim Streamline XR dripper tape is engineered for precision water delivery in row crop production. Each kit covers 1 acre and includes 500m of 16mm drip tape, pressure regulator, disc filter, and all fittings. Flow rate: 1.6 L/hr per emitter at 20 cm spacing. Reduces water use by up to 50% vs furrow irrigation. Saves fertilizer via fertigation. Proven in 110+ countries by 1.8M farmers.",
        price: 220, discountPrice: 189,
        category: c["Irrigation"], stock: 25, unit: "set", brand: "Netafim",
        isFeatured: true,
        tags: ["drip irrigation", "Netafim", "tape", "water saving", "row crops"],
        specifications: [
          { key: "Coverage", value: "1 Acre" },
          { key: "Drip Tape Length", value: "500 m" },
          { key: "Tape Diameter", value: "16 mm" },
          { key: "Emitter Spacing", value: "20 cm" },
          { key: "Flow Rate", value: "1.6 L/hr/emitter" },
          { key: "Water Savings", value: "Up to 50% vs furrow" },
          { key: "Origin", value: "Israel" },
        ],
        images: img("irrigation", 0),
      },
      {
        name: "Rain Bird 5000 Series Rotary Sprinkler Head (Set of 10)",
        shortDescription: "Commercial-grade rotary pop-up sprinklers for lawns & large fields",
        description: "The Rain Bird 5000 Series is the world's best-selling rotary sprinkler, trusted by golf courses, farms, and parks in 130+ countries. Matched precipitation rate across the full arc, from 40° to 360°. Adjustable radius 8–15 metres. Stainless steel pop-up shaft. Set of 10 heads covers approximately 700 m² with 70% overlap. Compatible with any standard irrigation controller.",
        price: 42, discountPrice: 36,
        category: c["Irrigation"], stock: 80, unit: "set", brand: "Rain Bird",
        isFeatured: false,
        tags: ["sprinkler", "Rain Bird", "rotary", "irrigation", "pop-up"],
        specifications: [
          { key: "Radius", value: "8–15 m (adjustable)" },
          { key: "Arc", value: "40°–360° (adjustable)" },
          { key: "Flow Rate", value: "0.6–1.8 m³/hr" },
          { key: "Operating Pressure", value: "1.7–4.5 bar" },
          { key: "Pop-up Height", value: "4 inches (10 cm)" },
          { key: "Set Includes", value: "10 heads" },
        ],
        images: img("irrigation", 1),
      },
      {
        name: "Grundfos CM5 Surface Pump (1 HP)",
        shortDescription: "Reliable centrifugal pump for borehole, tank & irrigation supply",
        description: "The Grundfos CM5 is a compact, corrosion-resistant stainless steel centrifugal pump from Denmark's leading pump manufacturer. Delivers up to 3.2 m³/hr at 4.5 bar. Designed for clean water supply from tanks, rivers, or boreholes for irrigation systems, livestock watering, and general farm use. Energy-efficient IE3 motor. Plug-and-play installation. 3-year warranty.",
        price: 185, discountPrice: 165,
        category: c["Irrigation"], stock: 35, unit: "piece", brand: "Grundfos",
        isFeatured: false,
        tags: ["pump", "Grundfos", "centrifugal", "irrigation pump", "borehole"],
        specifications: [
          { key: "Power", value: "1 HP (750W)" },
          { key: "Max Flow", value: "3.2 m³/hr" },
          { key: "Max Head", value: "45 m" },
          { key: "Outlet", value: "1 inch BSP" },
          { key: "Material", value: "Stainless steel body" },
          { key: "Origin", value: "Denmark" },
          { key: "Warranty", value: "3 years" },
        ],
        images: img("irrigation", 0),
      },

      /* ══════════════ CHEMICALS ══════════════ */
      {
        name: "Humus Gold Humic Acid Soil Conditioner (5 L)",
        shortDescription: "Liquid humic acid to improve soil structure and nutrient uptake",
        description: "Humus Gold is a concentrated liquid humic acid derived from Leonardite ore. When applied at 2–4 L/ha, it significantly improves soil cation exchange capacity, water holding capacity, and root proliferation. Chelates micronutrients (Fe, Zn, Mn, Cu) to prevent deficiencies. Compatible with most liquid fertilizers and pesticides for tank-mix application. Certified for organic production.",
        price: 35, discountPrice: 29,
        category: c["Chemicals"], stock: 220, unit: "litre", brand: "BioAg",
        isFeatured: false,
        tags: ["humic acid", "soil conditioner", "organic", "soil health", "root growth"],
        images: img("accessories", 0),
      },
      {
        name: "ADAMA Zetanil SL 500 Plant Growth Regulator (1 L)",
        shortDescription: "Mepiquat chloride PGR for cotton and maize lodging control",
        description: "Zetanil SL 500 contains 500 g/L mepiquat chloride — a plant growth regulator that controls internode elongation to reduce lodging in cotton and maize. Also applied in cotton to improve boll retention and earliness. Used by commercial cotton farmers in the USA, Brazil, and India. Apply at 0.5–1 L/ha at early squaring stage.",
        price: 48, discountPrice: null,
        category: c["Chemicals"], stock: 90, unit: "litre", brand: "ADAMA",
        isFeatured: false,
        tags: ["PGR", "mepiquat", "cotton", "lodging control", "growth regulator"],
        images: img("pesticide", 1),
      },
      {
        name: "Dow AgroSciences Surround WP Kaolin Clay (12.5 kg)",
        shortDescription: "Particle film technology — natural pest & heat stress protection",
        description: "Surround WP is a processed kaolin clay that forms a particle film on plant surfaces, deterring insect feeding and reducing heat stress. OMRI certified for organic production. Widely used on apples, pears, grapes, and vegetables against codling moth, leafhoppers, and stink bugs. Apply at 25–50 kg/ha season-long. Compliant with EU organic regulations.",
        price: 55, discountPrice: 49,
        category: c["Chemicals"], stock: 120, unit: "bag", brand: "PureSpray",
        isFeatured: false,
        tags: ["kaolin", "organic pest control", "particle film", "heat stress", "apple"],
        images: img("accessories", 1),
      },

      /* ══════════════ SEEDS ══════════════ */
      {
        name: "Corteva Pioneer P9400 Hybrid Maize Seed (80,000 seeds)",
        shortDescription: "Top-yielding hybrid corn — 180 BU/ac potential, excellent standability",
        description: "Pioneer P9400 is a premium 114-day hybrid from Corteva Agriscience, bred for maximum yield potential under North American and tropical conditions. Exceptional root and stalk strength for standability in high-yield environments. Disease resistant to Grey Leaf Spot, Northern Corn Leaf Blight, and Anthracnose Stalk Rot. Optimum planting density 32,000–36,000 seeds/acre. Treated with Lumisena + Insecticide seed treatment.",
        price: 145, discountPrice: 128,
        category: c["Seeds"], stock: 200, unit: "bag", brand: "Corteva Agriscience (Pioneer)",
        isFeatured: true,
        tags: ["hybrid maize", "Pioneer", "corn seed", "high yield", "Corteva"],
        specifications: [
          { key: "Relative Maturity", value: "114 days" },
          { key: "Yield Potential", value: "180 BU/acre" },
          { key: "Seed Count", value: "80,000 seeds/bag" },
          { key: "Drought Tolerance", value: "High" },
          { key: "Seed Treatment", value: "Lumisena + Insecticide" },
          { key: "Origin", value: "USA" },
        ],
        images: img("seeds", 0),
      },
      {
        name: "Syngenta NK Coker 258 Hybrid Sorghum (5 kg)",
        shortDescription: "Drought-tolerant hybrid sorghum for arid & semi-arid regions",
        description: "NK Coker 258 from Syngenta is a dual-purpose (grain + fodder) hybrid sorghum adapted to dry, semi-arid growing conditions in Africa, Asia, and Latin America. 90–100 day maturity. Yield potential 6–8 tonnes/ha under irrigation, 3–5 tonnes/ha rain-fed. Excellent tolerance to drought stress during grain fill. Resistant to Downy Mildew and Head Smut. Suitable for Sahel, East Africa, and South Asia.",
        price: 22, discountPrice: 18,
        category: c["Seeds"], stock: 300, unit: "bag", brand: "Syngenta",
        isFeatured: false,
        tags: ["sorghum", "hybrid", "drought tolerant", "Syngenta", "arid crops"],
        specifications: [
          { key: "Maturity", value: "90–100 days" },
          { key: "Yield (irrigated)", value: "6–8 t/ha" },
          { key: "Yield (rain-fed)", value: "3–5 t/ha" },
          { key: "Plant Height", value: "1.2–1.6 m" },
          { key: "Grain Colour", value: "White" },
          { key: "Sowing Rate", value: "8–10 kg/ha" },
        ],
        images: img("seeds", 1),
      },
      {
        name: "East-West Seeds Jumbo Tomato F1 Hybrid (10 g)",
        shortDescription: "High-yield, heat-tolerant F1 tomato for tropical markets",
        description: "East-West Seeds' Jumbo F1 is a determinate fresh-market tomato bred specifically for tropical and subtropical conditions. Produces uniform, round, firm fruits of 120–180 g at 70–75 days after transplanting. Resistant to Fusarium Wilt (Fov race 1), Verticillium, and Tomato Mosaic Virus. High lycopene content for premium market quality. Widely grown across Southeast Asia, East Africa, and the Caribbean.",
        price: 12, discountPrice: 10,
        category: c["Seeds"], stock: 500, unit: "packet", brand: "East-West Seed",
        isFeatured: true,
        tags: ["tomato seed", "F1 hybrid", "heat tolerant", "tropical", "East-West"],
        specifications: [
          { key: "Type", value: "F1 Hybrid, Determinate" },
          { key: "Days to Harvest", value: "70–75 days after transplant" },
          { key: "Fruit Weight", value: "120–180 g" },
          { key: "Disease Resistance", value: "Fusarium, Verticillium, TMV" },
          { key: "Seed Count", value: "~1,000 seeds/10g" },
          { key: "Origin", value: "Netherlands / Thailand" },
        ],
        images: img("seeds", 0),
      },
      {
        name: "Rijk Zwaan Paprika Sweet Pepper F1 Hybrid (1000 seeds)",
        shortDescription: "Blocky red sweet pepper — ideal for fresh market & processing",
        description: "From Rijk Zwaan (Netherlands), this blocky sweet bell pepper produces uniform, thick-walled fruits of 180–220 g with 3–4 lobes. Resistant to Cucumber Mosaic Virus, Tomato Spotted Wilt Virus, and Phytophthora Root Rot. 85–90 days to first harvest. Excellent shelf life for export markets. Suitable for open field and greenhouse production in temperate and Mediterranean climates.",
        price: 34, discountPrice: 30,
        category: c["Seeds"], stock: 180, unit: "packet", brand: "Rijk Zwaan",
        isFeatured: false,
        tags: ["pepper seed", "sweet pepper", "F1 hybrid", "Netherlands", "Rijk Zwaan"],
        images: img("seeds", 1),
      },
      {
        name: "USDA Certified Organic Sunflower Seeds — Mammoth (500 g)",
        shortDescription: "Giant edible sunflower — 300cm stalks, 30cm flower heads",
        description: "Certified organic Mammoth sunflower seeds producing the tallest, most impressive sunflowers in any farm or garden. Stalks grow to 3 metres, flower heads up to 30 cm. Seeds are edible with a rich, nutty flavour — excellent for pressed sunflower oil. Highly attractive to pollinators and beneficial insects. Matures in 70–80 days. Drought-tolerant once established.",
        price: 8, discountPrice: null,
        category: c["Seeds"], stock: 700, unit: "packet", brand: "Organic Valley Seeds",
        isFeatured: false,
        tags: ["sunflower", "organic", "edible", "pollinator", "oil crop"],
        images: img("seeds", 0),
      },

      /* ══════════════ FARM ACCESSORIES ══════════════ */
      {
        name: "3M Versaflo TR-600 Powered Air-Purifying Respirator",
        shortDescription: "PAPR respirator for pesticide application & crop protection work",
        description: "The 3M Versaflo TR-600 PAPR provides continuous fresh, filtered air for maximum protection during pesticide mixing, spraying, and post-spray re-entry. Includes TR-602E high-efficiency blower, S-655 M/L headcover, and BT-60 battery with 4-hr runtime. NIOSH and EU CE approved. Compatible with most 3M Scott supplied-air accessories. Far superior to disposable masks for professional agrochemical workers.",
        price: 280, discountPrice: 249,
        category: c["Farm Accessories"], stock: 30, unit: "piece", brand: "3M",
        isFeatured: false,
        tags: ["respirator", "PPE", "pesticide safety", "3M", "PAPR"],
        specifications: [
          { key: "Protection Factor", value: "≥ 1000× (APF1000)" },
          { key: "Battery Life", value: "4 hours continuous" },
          { key: "Air Flow", value: "170 L/min" },
          { key: "Certification", value: "NIOSH, CE EN12941" },
          { key: "Weight (blower)", value: "760 g" },
        ],
        images: img("accessories", 0),
      },
      {
        name: "RELN Pro 1000 L IBC Water Storage Tank",
        shortDescription: "1000-litre collapsible food-grade IBC for water & liquid fertilizer",
        description: "The RELN Pro IBC (Intermediate Bulk Container) is a 1000-litre food-grade polyethylene tank inside a galvanised steel cage. Suitable for storage of water, liquid fertilizers, and approved chemicals. Stackable for efficient warehouse storage. 150mm top fill lid and 50mm valve outlet. UN-approved for dangerous goods (for approved liquids). Compatible with standard pallet forklift.",
        price: 165, discountPrice: 148,
        category: c["Farm Accessories"], stock: 50, unit: "piece", brand: "RELN",
        isFeatured: false,
        tags: ["IBC tank", "water storage", "liquid fertilizer", "1000L", "tank"],
        specifications: [
          { key: "Capacity", value: "1,000 litres" },
          { key: "Material", value: "HDPE inner, galvanised steel cage" },
          { key: "Outlet Valve", value: "2-inch ball valve" },
          { key: "Fill Opening", value: "150mm cap" },
          { key: "UN Approval", value: "Yes (for approved liquids)" },
          { key: "Dimensions", value: "120×100×116 cm" },
        ],
        images: img("accessories", 1),
      },
      {
        name: "Dickies Redhawk Coverall — Chemical Resistant (L)",
        shortDescription: "Full-body protective coverall for spray operators and farm workers",
        description: "Dickies Redhawk is the preferred full-body protective coverall for European and African spray operators. Made from 65% polyester/35% cotton with a chemical-resistant finish to Type 6 EN13982. Elasticated waist, wrists, and ankles for a secure fit. Zip front with studded storm flap. Multiple pockets. Machine washable up to 60°C. Available in sizes XS–5XL.",
        price: 38, discountPrice: 32,
        category: c["Farm Accessories"], stock: 250, unit: "piece", brand: "Dickies Workwear",
        isFeatured: false,
        tags: ["coverall", "PPE", "chemical resistant", "spray suit", "farm safety"],
        images: img("accessories", 0),
      },
      {
        name: "AcquaFlex 50m Heavy-Duty Lay-Flat Irrigation Hose (2\")",
        shortDescription: "PVC lay-flat hose for pump-to-field water transfer",
        description: "AcquaFlex 2-inch PVC lay-flat hose is engineered for long-distance water transfer from pump to field. Rated at 6 bar working pressure with 18 bar burst strength. UV-stabilised for outdoor use. Lightweight when empty for easy manual handling. Complete with universal couplings on both ends. 50m roll covers standard field widths. Compatible with Honda, Koshin, and Loncin pumps.",
        price: 55, discountPrice: 48,
        category: c["Farm Accessories"], stock: 100, unit: "roll", brand: "AcquaFlex",
        isFeatured: false,
        tags: ["lay-flat hose", "irrigation hose", "PVC hose", "water transfer", "pump hose"],
        specifications: [
          { key: "Diameter", value: "2 inches (50mm)" },
          { key: "Length", value: "50 metres" },
          { key: "Working Pressure", value: "6 bar" },
          { key: "Burst Pressure", value: "18 bar" },
          { key: "Material", value: "PVC reinforced" },
          { key: "Couplings", value: "Universal aluminium (both ends)" },
        ],
        images: img("accessories", 1),
      },

      /* ══════════════ LIVESTOCK SUPPLIES ══════════════ */
      {
        name: "Zoetis Delvax Cattle 7-Way Vaccine (50-dose vial)",
        shortDescription: "Clostridial protection: blackleg, red water & malignant oedema",
        description: "Delvax 7-Way from Zoetis provides protection against seven clostridial diseases in cattle and sheep: Blackleg (Cl. chauvoei), Red Water (Cl. haemolyticum), Malignant Oedema (Cl. septicum), Cl. novyi, Cl. perfringens types B, C, D. A single primary course (2 mL IM) + annual booster protects the whole herd. Used by commercial beef and dairy operations in 80+ countries. Store at 2–8°C.",
        price: 48, discountPrice: 42,
        category: c["Livestock Supplies"], stock: 80, unit: "vial", brand: "Zoetis",
        isFeatured: false,
        tags: ["cattle vaccine", "clostridial", "Zoetis", "livestock health", "blackleg"],
        specifications: [
          { key: "Dose Volume", value: "2 mL per animal" },
          { key: "Vial Size", value: "50 doses (100 mL)" },
          { key: "Route", value: "Intramuscular (IM)" },
          { key: "Target Species", value: "Cattle, Sheep" },
          { key: "Withdrawal Period", value: "Meat: 21 days" },
          { key: "Storage", value: "2–8°C, do not freeze" },
        ],
        images: img("livestock", 0),
      },
      {
        name: "Purina AntlerMax Deer & Elk Pellet Feed (20 kg)",
        shortDescription: "High-protein performance feed for antler growth & body condition",
        description: "Purina AntlerMax is a scientifically formulated 16% protein pelleted feed for deer and elk in managed hunting preserves, farms, and zoos. Contains optimal copper, zinc, and manganese levels shown to maximise antler growth potential in research. Includes proprietary Purina Outlast gut-health technology. Highly palatable. Use as a supplement alongside natural forage or as a complete feed in pen situations.",
        price: 32, discountPrice: null,
        category: c["Livestock Supplies"], stock: 120, unit: "bag", brand: "Purina Animal Nutrition",
        isFeatured: false,
        tags: ["deer feed", "elk feed", "antler", "Purina", "wildlife management"],
        images: img("livestock", 1),
      },
      {
        name: "Gallagher S100 Solar Electric Fence Energizer",
        shortDescription: "Solar-powered fence energizer for cattle, goat & predator control",
        description: "The Gallagher S100 is a 0.1J solar-powered electric fence energizer from New Zealand's leading animal control brand. Powers up to 5 km of fence in good conditions. Built-in 6V rechargeable gel battery provides 3+ weeks of continuous operation without sun. LED indicator shows charge level. Ideal for paddock rotation in remote areas without mains power. Protects against cattle, sheep, horses, and predators.",
        price: 125, discountPrice: 108,
        category: c["Livestock Supplies"], stock: 55, unit: "piece", brand: "Gallagher",
        isFeatured: false,
        tags: ["electric fence", "solar", "Gallagher", "livestock containment", "paddock"],
        specifications: [
          { key: "Output Energy", value: "0.1 joules stored" },
          { key: "Fence Coverage", value: "Up to 5 km" },
          { key: "Solar Panel", value: "2W integrated" },
          { key: "Battery", value: "6V 4Ah gel" },
          { key: "Origin", value: "New Zealand" },
        ],
        images: img("livestock", 0),
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create / update admin user
    const adminEmail = "admin@farmsphere.africa";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "FarmSphere Admin",
        email: adminEmail,
        password: "Admin@2025!",
        role: "admin",
        phone: "+2348012345678",
      });
      console.log(`✅ Admin user created: ${adminEmail} / Admin@2025!`);
    } else {
      console.log("ℹ️  Admin user already exists — skipped.");
    }

    console.log("\n🌍 FarmSphere database seeded successfully!");
    console.log("─────────────────────────────────────────────");
    console.log(`Categories : ${createdCategories.length}`);
    console.log(`Products   : ${createdProducts.length} (international catalogue)`);
    console.log(`Admin      : ${adminEmail}`);
    console.log("─────────────────────────────────────────────");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
