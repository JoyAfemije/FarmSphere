/**
 * Seed Script — populates database with initial categories and products
 * Run: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

const categories = [
  { name: "Tools & Equipment", icon: "🔧", description: "Power tools, hand tools, and farm machinery for modern Nigerian farming", order: 1 },
  { name: "Fertilizers", icon: "🌱", description: "NPK, organic, and specialty fertilizers for maximum crop yield", order: 2 },
  { name: "Pesticides", icon: "🛡️", description: "Insecticides, herbicides, and fungicides for crop protection", order: 3 },
  { name: "Irrigation", icon: "💧", description: "Drip irrigation, sprinkler systems, and water management equipment", order: 4 },
  { name: "Chemicals", icon: "🧪", description: "Soil enhancers, growth regulators, and specialty agricultural chemicals", order: 5 },
  { name: "Seeds", icon: "🌾", description: "Hybrid, open-pollinated, and certified seeds for all crops", order: 6 },
  { name: "Farm Accessories", icon: "🏡", description: "Protective gear, storage solutions, and general farm accessories", order: 7 },
  { name: "Livestock Supplies", icon: "🐄", description: "Animal feed, health products, and livestock housing equipment", order: 8 },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category map for easy lookup
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });

    // Seed products
    const products = [
      // Fertilizers
      {
        name: "Notore NPK Fertilizer 20-10-10 (50kg)",
        shortDescription: "High-nitrogen NPK blend for cereals, maize, and vegetables",
        description: "Notore NPK 20-10-10 is Nigeria's most trusted granular fertilizer. Contains 20% Nitrogen, 10% Phosphorus, and 10% Potassium. Ideal for maize, sorghum, wheat, and most vegetable crops. Promotes vigorous vegetative growth and improves root development. One bag treats approximately 1 acre. NAFDAC and NASC certified.",
        price: 28000,
        discountPrice: 24500,
        category: catMap["Fertilizers"],
        stock: 500,
        unit: "bag",
        brand: "Notore Chemical Industries",
        isFeatured: true,
        tags: ["fertilizer", "NPK", "maize", "crop nutrition", "nitrogen"],
        specifications: [
          { key: "Weight", value: "50 kg" },
          { key: "N:P:K Ratio", value: "20:10:10" },
          { key: "Form", value: "Granular" },
          { key: "Application", value: "Broadcast or band placement" },
          { key: "Crops", value: "Maize, Sorghum, Wheat, Vegetables" },
          { key: "Coverage", value: "1 acre" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", alt: "NPK Fertilizer" }],
      },
      {
        name: "Urea Fertilizer 46% Nitrogen (50kg Bag)",
        shortDescription: "High-nitrogen urea for rice, maize, and all leafy crops",
        description: "Premium quality Urea fertilizer with 46% Nitrogen content. Best for top dressing on rice, maize, sugar cane, and leafy vegetables. Highly water-soluble for fast uptake. Increases yield by up to 40% when applied correctly. Store in a cool, dry place.",
        price: 22000,
        discountPrice: 19500,
        category: catMap["Fertilizers"],
        stock: 800,
        unit: "bag",
        brand: "Indorama Fertilizers",
        isFeatured: true,
        tags: ["urea", "fertilizer", "nitrogen", "rice", "maize"],
        images: [{ url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80", alt: "Urea Fertilizer" }],
      },

      // Pesticides
      {
        name: "Cypermethrin 10% EC Insecticide (1 Litre)",
        shortDescription: "Broad-spectrum insecticide for vegetables, cotton and cereals",
        description: "Cypermethrin 10% EC is a powerful synthetic pyrethroid insecticide effective against a wide range of insects including thrips, aphids, whiteflies, caterpillars, and beetles. Quick knockdown with long residual action. Safe pre-harvest interval of 7 days for vegetables. Mix 10-20ml per 15 litres of water.",
        price: 4500,
        discountPrice: 3800,
        category: catMap["Pesticides"],
        stock: 300,
        unit: "litre",
        brand: "Syngenta Nigeria",
        isFeatured: true,
        tags: ["insecticide", "cypermethrin", "pests", "vegetables", "cotton"],
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80", alt: "Insecticide" }],
      },
      {
        name: "Glyphosate 360 g/L Herbicide (5 Litres)",
        shortDescription: "Non-selective total herbicide for weed control before planting",
        description: "Glyphosate 360 is a post-emergence, non-selective systemic herbicide that controls all annual and perennial weeds. Ideal for land clearing before planting. Apply at 1.5-4 litres per hectare depending on weed pressure. Translocated to roots for complete kill. Biodegradable in soil within 1-2 weeks.",
        price: 12500,
        discountPrice: 10800,
        category: catMap["Pesticides"],
        stock: 200,
        unit: "litre",
        brand: "Bayer CropScience",
        tags: ["herbicide", "glyphosate", "weed control", "land clearing"],
        images: [{ url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=600&q=80", alt: "Herbicide" }],
      },

      // Tools & Equipment
      {
        name: "Honda GX200 Power Tiller / Cultivator",
        shortDescription: "7HP petrol-powered mini tractor for small to medium farms",
        description: "The Honda GX200 Power Tiller is the workhorse of Nigerian small-scale farming. Powered by Honda's reliable 7HP GX200 engine. Tills up to 30cm deep and 60cm wide. Suitable for all soil types including heavy clay soils. Includes 6 forward speeds and 2 reverse speeds. Complete with ridger, hiller, and standard blades. 1-year manufacturer warranty.",
        price: 450000,
        discountPrice: 385000,
        category: catMap["Tools & Equipment"],
        stock: 15,
        unit: "piece",
        brand: "Honda Nigeria",
        isFeatured: true,
        tags: ["power tiller", "cultivator", "Honda", "farm machinery", "tractor"],
        specifications: [
          { key: "Engine", value: "Honda GX200 7HP 4-stroke" },
          { key: "Tilling Width", value: "60 cm" },
          { key: "Tilling Depth", value: "Up to 30 cm" },
          { key: "Fuel", value: "Petrol" },
          { key: "Weight", value: "95 kg" },
          { key: "Warranty", value: "1 Year" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80", alt: "Power Tiller" }],
      },
      {
        name: "25-Litre Knapsack Sprayer with Brass Pump",
        shortDescription: "Manual backpack sprayer for pesticides, herbicides & fertilizers",
        description: "Heavy-duty 25-litre knapsack sprayer with corrosion-resistant brass pump and stainless steel wand. Double acting pump for smooth, continuous spray. Adjustable nozzle (cone, fan, jet). Padded shoulder straps for comfortable use. Suitable for spraying insecticides, herbicides, liquid fertilizers, and fungicides.",
        price: 15500,
        discountPrice: 12800,
        category: catMap["Tools & Equipment"],
        stock: 120,
        unit: "piece",
        brand: "Yamaho",
        isFeatured: true,
        tags: ["sprayer", "knapsack", "pesticide application", "backpack sprayer"],
        images: [{ url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", alt: "Knapsack Sprayer" }],
      },

      // Irrigation
      {
        name: "Complete Drip Irrigation Kit (1 Acre)",
        shortDescription: "Water-saving drip irrigation system for vegetables and orchards",
        description: "Complete drip irrigation system for 1 acre. Includes: 500m drip tape, 1HP submersible pump, filter system, main and sub-main PVC pipes, pressure regulators, and all fittings. Reduces water usage by 60% compared to flood irrigation. Perfect for vegetables (tomato, pepper, cucumber) and fruit orchards. Easy installation — complete in 2-3 days. Full technical support via WhatsApp.",
        price: 185000,
        discountPrice: 158000,
        category: catMap["Irrigation"],
        stock: 20,
        unit: "set",
        brand: "Netafim Nigeria",
        isFeatured: true,
        tags: ["drip irrigation", "water saving", "vegetables", "irrigation kit"],
        specifications: [
          { key: "Coverage", value: "1 Acre" },
          { key: "Water Savings", value: "60% vs flood irrigation" },
          { key: "Pump Power", value: "1HP submersible" },
          { key: "Drip Tape Length", value: "500 metres" },
          { key: "Emitter Spacing", value: "20 cm" },
          { key: "Flow Rate", value: "1.6 L/hr per emitter" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80", alt: "Drip Irrigation" }],
      },

      // Seeds
      {
        name: "DK8031 Pioneer Hybrid Maize Seed (5kg)",
        shortDescription: "High-yield drought-tolerant hybrid maize for all zones",
        description: "DK8031 is Corteva's (Pioneer) best-selling hybrid maize variety in Nigeria. Exceptional drought tolerance with 100-105 day maturity. Yield potential of 8-12 tonnes per hectare under good management. Disease resistance to Grey Leaf Spot, Northern Corn Leaf Blight. Suitable for all Nigerian agro-ecological zones. Treated with fungicide + insecticide seed treatment.",
        price: 18500,
        discountPrice: 16200,
        category: catMap["Seeds"],
        stock: 250,
        unit: "kg",
        brand: "Corteva Agriscience (Pioneer)",
        isFeatured: true,
        tags: ["maize seed", "hybrid", "Pioneer", "DK8031", "drought tolerant"],
        specifications: [
          { key: "Maturity", value: "100-105 days" },
          { key: "Yield Potential", value: "8-12 tonnes/ha" },
          { key: "Drought Tolerance", value: "High" },
          { key: "Spacing", value: "75cm × 25cm (2 seeds/hole)" },
          { key: "Seed Rate", value: "20-25 kg/ha" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=80", alt: "Maize Seeds" }],
      },

      // Farm Accessories
      {
        name: "Chemical-Resistant Farming Gloves (Pack of 3)",
        shortDescription: "Heavy-duty protective gloves for safe agrochemical handling",
        description: "Premium nitrile chemical-resistant farming gloves. Protects hands from pesticides, fertilizers, and other agrochemicals. Non-slip textured grip for secure handling of spray equipment. Elbow-length design for maximum protection. One size fits most. Pack includes 3 pairs. Essential PPE for every Nigerian farmer.",
        price: 3500,
        discountPrice: 2800,
        category: catMap["Farm Accessories"],
        stock: 500,
        unit: "pack",
        brand: "AgroSafe",
        tags: ["gloves", "PPE", "safety", "chemical resistant", "farm accessories"],
        images: [{ url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", alt: "Farming Gloves" }],
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user
    const adminExists = await User.findOne({ email: "admin@agrotech.ng" });
    if (!adminExists) {
      await User.create({
        name: "Agrotech Admin",
        email: "admin@agrotech.ng",
        password: "Admin@2025!",
        role: "admin",
        phone: "+2348012345678",
      });
      console.log("✅ Admin user created: admin@agrotech.ng / Admin@2025!");
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("─────────────────────────────");
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products:   ${createdProducts.length}`);
    console.log(`Admin:      admin@agrotech.ng`);
    console.log("─────────────────────────────");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedDatabase();
