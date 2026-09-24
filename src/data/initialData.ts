import { 
  Product, 
  Ingredient, 
  Recipe, 
  ProductionBatch, 
  CustomOrder, 
  SaleTransaction, 
  WasteRecord, 
  BakerySettings 
} from '../types/bakery';

export const INITIAL_SETTINGS: BakerySettings = {
  bakeryName: "Crumb & Crust Bakehouse",
  tagline: "Slow-fermented artisan sourdough & French viennoiserie",
  address: "142 Mill Street, Old Bakery Square",
  phone: "(555) 382-2537",
  taxRate: 0.07, // 7% local sales tax
  currencySymbol: "$",
  receiptFooterNote: "Baked fresh with 100% stoneground organic flour. Thank you for supporting your local baker!",
  morningBakeStart: "04:30"
};

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: "ing-1",
    name: "Organic T65 Strong Bread Flour",
    category: "flour",
    currentStock: 145,
    unit: "kg",
    reorderLevel: 50,
    costPerUnit: 1.85,
    supplier: "Valley Organic Millers",
    lastRestocked: "2026-09-20"
  },
  {
    id: "ing-2",
    name: "Stoneground Whole Rye Flour",
    category: "flour",
    currentStock: 32,
    unit: "kg",
    reorderLevel: 20,
    costPerUnit: 2.20,
    supplier: "Valley Organic Millers",
    lastRestocked: "2026-09-18"
  },
  {
    id: "ing-3",
    name: "Unbleached Pastry Flour (T45)",
    category: "flour",
    currentStock: 80,
    unit: "kg",
    reorderLevel: 30,
    costPerUnit: 1.95,
    supplier: "Valley Organic Millers",
    lastRestocked: "2026-09-21"
  },
  {
    id: "ing-4",
    name: "Normandy Cultured Butter 84% Fat",
    category: "dairy",
    currentStock: 28,
    unit: "kg",
    reorderLevel: 15,
    costPerUnit: 8.50,
    supplier: "Gourmet Dairy Imports",
    lastRestocked: "2026-09-22"
  },
  {
    id: "ing-5",
    name: "Organic Whole Milk",
    category: "dairy",
    currentStock: 18,
    unit: "L",
    reorderLevel: 12,
    costPerUnit: 2.10,
    supplier: "Meadowlands Dairy",
    lastRestocked: "2026-09-23"
  },
  {
    id: "ing-6",
    name: "Free-Range Farm Eggs",
    category: "dairy",
    currentStock: 120,
    unit: "pcs",
    reorderLevel: 60,
    costPerUnit: 0.35,
    supplier: "Sunrise Pasture Farms",
    lastRestocked: "2026-09-22"
  },
  {
    id: "ing-7",
    name: "Fine Guérande Sea Salt",
    category: "other",
    currentStock: 22,
    unit: "kg",
    reorderLevel: 10,
    costPerUnit: 1.40,
    supplier: "Spice & Salt Trading Co.",
    lastRestocked: "2026-09-10"
  },
  {
    id: "ing-8",
    name: "Fresh Baker's Yeast",
    category: "leaven",
    currentStock: 4.5,
    unit: "kg",
    reorderLevel: 2,
    costPerUnit: 5.60,
    supplier: "Baking Essentials Direct",
    lastRestocked: "2026-09-21"
  },
  {
    id: "ing-9",
    name: "Valrhona 70% Dark Chocolate Batons",
    category: "inclusions",
    currentStock: 8.5,
    unit: "kg",
    reorderLevel: 5,
    costPerUnit: 24.00,
    supplier: "Artisan Chocolate Supply",
    lastRestocked: "2026-09-15"
  },
  {
    id: "ing-10",
    name: "Kalamata Olives (Pitted)",
    category: "inclusions",
    currentStock: 6.2,
    unit: "kg",
    reorderLevel: 4,
    costPerUnit: 9.80,
    supplier: "Mediterranean Pantry",
    lastRestocked: "2026-09-16"
  },
  {
    id: "ing-11",
    name: "Extra Virgin Olive Oil (Cold-Pressed)",
    category: "fats",
    currentStock: 14,
    unit: "L",
    reorderLevel: 8,
    costPerUnit: 11.50,
    supplier: "Mediterranean Pantry",
    lastRestocked: "2026-09-14"
  },
  {
    id: "ing-12",
    name: "Madagascar Bourbon Vanilla Pods",
    category: "inclusions",
    currentStock: 25,
    unit: "pcs",
    reorderLevel: 10,
    costPerUnit: 3.20,
    supplier: "Direct Spice Imports",
    lastRestocked: "2026-09-08"
  },
  {
    id: "ing-13",
    name: "Fresh Organic Raspberries & Blackberries",
    category: "inclusions",
    currentStock: 4.8,
    unit: "kg",
    reorderLevel: 3,
    costPerUnit: 14.50,
    supplier: "Brambleberry Orchards",
    lastRestocked: "2026-09-23"
  },
  {
    id: "ing-14",
    name: "Biodegradable Kraft Bakery Boxes (Medium)",
    category: "packaging",
    currentStock: 190,
    unit: "pcs",
    reorderLevel: 100,
    costPerUnit: 0.45,
    supplier: "EcoPack Direct",
    lastRestocked: "2026-09-12"
  },
  {
    id: "ing-15",
    name: "Artisan Bread Sleeves & Window Bags",
    category: "packaging",
    currentStock: 340,
    unit: "pcs",
    reorderLevel: 150,
    costPerUnit: 0.18,
    supplier: "EcoPack Direct",
    lastRestocked: "2026-09-12"
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    name: "Classic Country Sourdough Boule",
    category: "breads",
    baseYield: 12,
    yieldUnit: "loaves",
    preparationMinutes: 1200, // 20 hours long ferment
    bakeMinutes: 38,
    bakeTempC: 240,
    ingredients: [
      { ingredientId: "ing-1", name: "Organic T65 Strong Bread Flour", amount: 5400, unit: "g", isFlour: true },
      { ingredientId: "ing-2", name: "Stoneground Whole Rye Flour", amount: 600, unit: "g", isFlour: true },
      { ingredientId: "ing-7", name: "Fine Guérande Sea Salt", amount: 120, unit: "g" },
      { ingredientId: "ing-15", name: "Artisan Bread Sleeves & Window Bags", amount: 12, unit: "pcs" }
    ],
    instructions: [
      "Autolyse flour and water at 78% hydration for 60 minutes.",
      "Incorporate 20% ripe sourdough starter (1200g) and salt. Rubaud mix for 6 minutes.",
      "Perform 4 coil folds at 30-minute intervals in warm ambient proofer (26°C).",
      "Bulk ferment until 55% volume increase is achieved.",
      "Pre-shape into loose rounds; bench rest 20 minutes.",
      "Final shape into bannetons and cold retard at 4°C for 14-16 hours.",
      "Score deep crescent ear; bake in deck oven with 4 seconds steam at 240°C for 20 mins, vent open for 18 mins."
    ],
    bakerNotes: "Watch ambient humidity. If room is dry, mist banneton liners lightly before overnight refrigeration."
  },
  {
    id: "rec-2",
    name: "Traditional French Butter Croissant",
    category: "viennoiserie",
    baseYield: 24,
    yieldUnit: "croissants",
    preparationMinutes: 1080,
    bakeMinutes: 18,
    bakeTempC: 195,
    ingredients: [
      { ingredientId: "ing-3", name: "Unbleached Pastry Flour (T45)", amount: 1200, unit: "g", isFlour: true },
      { ingredientId: "ing-4", name: "Normandy Cultured Butter 84% Fat", amount: 650, unit: "g" },
      { ingredientId: "ing-5", name: "Organic Whole Milk", amount: 350, unit: "ml" },
      { ingredientId: "ing-8", name: "Fresh Baker's Yeast", amount: 28, unit: "g" },
      { ingredientId: "ing-7", name: "Fine Guérande Sea Salt", amount: 24, unit: "g" },
      { ingredientId: "ing-6", name: "Free-Range Farm Eggs (Egg Wash)", amount: 2, unit: "pcs" }
    ],
    instructions: [
      "Knead détrempe dough until silky, rest chilled overnight at 3°C.",
      "Prepare butter beurrage slab at 14°C.",
      "Lock in butter slab; complete one double turn (book) and one single turn (envelope).",
      "Chill 60 minutes between laminations.",
      "Sheet dough to 3.5mm thickness; cut isosceles triangles (9cm base x 28cm height).",
      "Gently stretch and roll tightly; proof at 27°C / 80% humidity for 2.5 hours.",
      "Double egg wash lightly; bake at 195°C with no steam until deep honeycomb golden."
    ],
    bakerNotes: "Do not exceed 27°C proofing temperature or laminated butter layers will melt into the dough!"
  },
  {
    id: "rec-3",
    name: "Rosemary & Kalamata Olive Focaccia",
    category: "savory",
    baseYield: 4,
    yieldUnit: "sheet pans (32 portions)",
    preparationMinutes: 300,
    bakeMinutes: 24,
    bakeTempC: 225,
    ingredients: [
      { ingredientId: "ing-1", name: "Organic T65 Strong Bread Flour", amount: 2400, unit: "g", isFlour: true },
      { ingredientId: "ing-11", name: "Extra Virgin Olive Oil (Cold-Pressed)", amount: 380, unit: "ml" },
      { ingredientId: "ing-10", name: "Kalamata Olives (Pitted)", amount: 450, unit: "g" },
      { ingredientId: "ing-7", name: "Fine Guérande Sea Salt", amount: 48, unit: "g" },
      { ingredientId: "ing-8", name: "Fresh Baker's Yeast", amount: 22, unit: "g" }
    ],
    instructions: [
      "High hydration mix (84% water) with 80ml olive oil in dough.",
      "Series of 3 stretch and folds inside oiled tub every 45 mins.",
      "Transfer into seasoned iron sheet pans lined generously with cold-pressed olive oil.",
      "Proof 90 minutes until bubbly and jiggly.",
      "Dimple firmly with oiled fingertips; embed olives, fresh rosemary needles, and flake salt.",
      "Bake hot on hearth deck at 225°C until bottom is crisp and golden."
    ],
    bakerNotes: "Brush immediately with warm olive oil and salt brine upon exit from oven for signature glistening crust."
  },
  {
    id: "rec-4",
    name: "Wild Berry & Vanilla Bean Sable Tart",
    category: "patisserie",
    baseYield: 8,
    yieldUnit: "tarts (6-inch)",
    preparationMinutes: 180,
    bakeMinutes: 22,
    bakeTempC: 175,
    ingredients: [
      { ingredientId: "ing-3", name: "Unbleached Pastry Flour (T45)", amount: 650, unit: "g", isFlour: true },
      { ingredientId: "ing-4", name: "Normandy Cultured Butter 84% Fat", amount: 320, unit: "g" },
      { ingredientId: "ing-5", name: "Organic Whole Milk", amount: 600, unit: "ml" },
      { ingredientId: "ing-6", name: "Free-Range Farm Eggs", amount: 6, unit: "pcs" },
      { ingredientId: "ing-12", name: "Madagascar Bourbon Vanilla Pods", amount: 2, unit: "pcs" },
      { ingredientId: "ing-13", name: "Fresh Organic Raspberries & Blackberries", amount: 900, unit: "g" },
      { ingredientId: "ing-14", name: "Biodegradable Kraft Bakery Boxes (Medium)", amount: 8, unit: "pcs" }
    ],
    instructions: [
      "Prepare sweet sablé dough, blind bake fluted 6-inch tart rings with micro-perforated mats at 165°C.",
      "Infuse warm whole milk with scraped Madagascar bourbon vanilla beans.",
      "Whisk egg yolks and sugar, thicken pastry cream (crème pâtissière) over medium heat.",
      "Fold in cold cubed butter, cool flat with contact plastic wrap.",
      "Pipe silk pastry cream into baked cooled shells.",
      "Artfully mound fresh wild berries; brush with clear neutral pectin glaze."
    ],
    bakerNotes: "Assemble max 4 hours before counter display to keep sable shell crisp and prevent cream absorption."
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Artisan Country Sourdough",
    category: "breads",
    price: 8.50,
    unit: "loaf",
    stock: 18,
    minStockAlert: 5,
    recipeId: "rec-1",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    description: "Naturally leavened with our 7-year wild starter, crisp caramelized crust and open custard crumb.",
    allergens: ["Wheat (Gluten)"],
    isAvailable: true,
    dailyTarget: 36
  },
  {
    id: "prod-2",
    name: "French Butter Croissant",
    category: "viennoiserie",
    price: 4.75,
    unit: "pc",
    stock: 22,
    minStockAlert: 8,
    recipeId: "rec-2",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    description: "Made with 84% Normandy cultured butter, laminated over 3 days for maximum honeycomb layers.",
    allergens: ["Wheat (Gluten)", "Dairy", "Eggs"],
    isAvailable: true,
    dailyTarget: 48
  },
  {
    id: "prod-3",
    name: "Wild Berry Patisserie Tart",
    category: "patisserie",
    price: 11.50,
    unit: "tart",
    stock: 7,
    minStockAlert: 3,
    recipeId: "rec-4",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
    description: "Sablé Breton tart shell with bourbon vanilla bean pastry cream and hand-picked fresh seasonal berries.",
    allergens: ["Wheat (Gluten)", "Dairy", "Eggs"],
    isAvailable: true,
    dailyTarget: 16
  },
  {
    id: "prod-4",
    name: "Rosemary & Kalamata Focaccia",
    category: "savory",
    price: 6.25,
    unit: "square",
    stock: 14,
    minStockAlert: 4,
    recipeId: "rec-3",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
    description: "Slow fermented olive oil focaccia baked with pitted kalamata olives and fresh hand-harvested rosemary.",
    allergens: ["Wheat (Gluten)"],
    isAvailable: true,
    dailyTarget: 24
  },
  {
    id: "prod-5",
    name: "Pain au Chocolat (Valrhona)",
    category: "viennoiserie",
    price: 5.25,
    unit: "pc",
    stock: 16,
    minStockAlert: 6,
    recipeId: "rec-2",
    image: "https://images.unsplash.com/photo-1623334044303-2510e609b7d3?auto=format&fit=crop&w=600&q=80",
    description: "Two batons of dark 70% French Valrhona chocolate folded into laminated butter pastry.",
    allergens: ["Wheat (Gluten)", "Dairy", "Eggs", "Soy (in chocolate)"],
    isAvailable: true,
    dailyTarget: 36
  },
  {
    id: "prod-6",
    name: "Cardamom & Brown Butter Knot",
    category: "viennoiserie",
    price: 4.95,
    unit: "pc",
    stock: 12,
    minStockAlert: 5,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    description: "Swedish-style brioche twisted with cracked green cardamom seeds, brown butter, and Swedish pearl sugar.",
    allergens: ["Wheat (Gluten)", "Dairy", "Eggs"],
    isAvailable: true,
    dailyTarget: 24
  },
  {
    id: "prod-7",
    name: "Seeded Rye Batard (Caraway & Sunflower)",
    category: "breads",
    price: 9.00,
    unit: "loaf",
    stock: 9,
    minStockAlert: 4,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
    description: "40% whole grain rye with toasted sunflower seeds, flax, and caraway aroma.",
    allergens: ["Wheat (Gluten)", "Rye"],
    isAvailable: true,
    dailyTarget: 18
  },
  {
    id: "prod-8",
    name: "Double Shot Cortado / Espresso",
    category: "beverages",
    price: 4.25,
    unit: "cup",
    stock: 999, // Prepared to order
    minStockAlert: 50,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    description: "Locally roasted heirloom espresso blend with equal parts velvety steamed milk.",
    allergens: ["Dairy (Oat/Almond milk available)"],
    isAvailable: true,
    dailyTarget: 75
  },
  {
    id: "prod-9",
    name: "Pour-Over Filter Coffee (Single Origin)",
    category: "beverages",
    price: 4.50,
    unit: "cup",
    stock: 999,
    minStockAlert: 50,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80",
    description: "Washed Ethiopian Yirgacheffe with jasmine and bergamot floral notes.",
    allergens: [],
    isAvailable: true,
    dailyTarget: 60
  }
];

export const INITIAL_BATCHES: ProductionBatch[] = [
  {
    id: "batch-101",
    batchNumber: "B-260924-01",
    recipeId: "rec-1",
    recipeName: "Classic Country Sourdough Boule",
    scheduledTime: "04:30",
    targetYield: 24,
    actualYield: 24,
    wasteYield: 0,
    stage: "ready",
    startTime: "04:30",
    endTime: "06:15",
    assignedBaker: "Julian (Head Baker)",
    notes: "Oven spring was exceptional today, 80% hydration felt balanced."
  },
  {
    id: "batch-102",
    batchNumber: "B-260924-02",
    recipeId: "rec-2",
    recipeName: "Traditional French Butter Croissant",
    scheduledTime: "05:15",
    targetYield: 36,
    actualYield: 34,
    wasteYield: 2,
    stage: "ready",
    startTime: "05:15",
    endTime: "06:45",
    assignedBaker: "Claire (Pastry Chef)",
    notes: "2 units slightly dark on bottom rack, kept aside for staff tasting."
  },
  {
    id: "batch-103",
    batchNumber: "B-260924-03",
    recipeId: "rec-3",
    recipeName: "Rosemary & Kalamata Olive Focaccia",
    scheduledTime: "08:30",
    targetYield: 16,
    stage: "baking",
    startTime: "08:30",
    timerMinutesRemaining: 12,
    timerRunning: true,
    assignedBaker: "Julian",
    notes: "Pans in deck oven #2 at 225°C. Flake salt sprinkled generously."
  },
  {
    id: "batch-104",
    batchNumber: "B-260924-04",
    recipeId: "rec-4",
    recipeName: "Wild Berry & Vanilla Bean Sable Tart",
    scheduledTime: "10:00",
    targetYield: 10,
    stage: "proofing",
    assignedBaker: "Claire",
    notes: "Sable shells blind baked and cooling; pastry cream infusing with vanilla pods."
  },
  {
    id: "batch-105",
    batchNumber: "B-260924-05",
    recipeId: "rec-1",
    recipeName: "Country Sourdough - Afternoon Refresh",
    scheduledTime: "13:30",
    targetYield: 18,
    stage: "scheduled",
    assignedBaker: "Julian",
    notes: "To cover 4:00 PM evening rush bread reservations."
  }
];

export const INITIAL_CUSTOM_ORDERS: CustomOrder[] = [
  {
    id: "ord-201",
    orderNumber: "ORD-942",
    customerName: "Eleanor Vance",
    customerPhone: "(555) 839-1192",
    customerEmail: "eleanor.v@example.com",
    pickupDate: "2026-09-24", // Today
    pickupTime: "11:30",
    itemsDescription: "1x 8-inch Wild Berry Chantilly Cake (Custom writing: 'Happy 40th Thomas!'), 4x Butter Croissants, 2x Baguettes",
    specialInstructions: "Box tied with bakery twine. Please include 1 pack of beeswax birthday candles.",
    totalAmount: 68.00,
    depositPaid: 35.00,
    balanceDue: 33.00,
    status: "ready",
    createdAt: "2026-09-21"
  },
  {
    id: "ord-202",
    orderNumber: "ORD-943",
    customerName: "St. Jude Community Breakfast",
    customerPhone: "(555) 441-9002",
    pickupDate: "2026-09-24", // Today
    pickupTime: "15:00",
    itemsDescription: "3x Whole Focaccia sheet trays (sliced into 24 party squares), 12x Cardamom Knots",
    specialInstructions: "Cut into cocktail bites, provide parchment separators in catering trays.",
    totalAmount: 94.50,
    depositPaid: 94.50,
    balanceDue: 0.00,
    status: "in_prep",
    createdAt: "2026-09-22"
  },
  {
    id: "ord-203",
    orderNumber: "ORD-944",
    customerName: "Chef Martin Roy (Bistrot Blanc)",
    customerPhone: "(555) 723-6610",
    customerEmail: "martin@bistrotblanc.com",
    pickupDate: "2026-09-25", // Tomorrow
    pickupTime: "07:30",
    itemsDescription: "14x Sourdough Boules (Uncut, dark bake crust for dinner service)",
    specialInstructions: "Standing wholesale account. Leave in baker delivery crates at side entrance.",
    totalAmount: 98.00,
    depositPaid: 0.00,
    balanceDue: 98.00,
    status: "confirmed",
    createdAt: "2026-09-23"
  }
];

export const INITIAL_TRANSACTIONS: SaleTransaction[] = [
  {
    id: "tx-301",
    receiptNumber: "REC-1081",
    timestamp: "2026-09-24 07:15",
    items: [
      { productId: "prod-2", productName: "French Butter Croissant", quantity: 2, unitPrice: 4.75, total: 9.50 },
      { productId: "prod-8", productName: "Double Shot Cortado", quantity: 1, unitPrice: 4.25, total: 4.25 }
    ],
    subtotal: 13.75,
    taxAmount: 0.96,
    discountAmount: 0.00,
    total: 14.71,
    paymentMethod: "contactless",
    cashierName: "Sophie"
  },
  {
    id: "tx-302",
    receiptNumber: "REC-1082",
    timestamp: "2026-09-24 07:42",
    items: [
      { productId: "prod-1", productName: "Artisan Country Sourdough", quantity: 1, unitPrice: 8.50, total: 8.50, selectedOption: "Sliced (Medium)" },
      { productId: "prod-5", productName: "Pain au Chocolat", quantity: 2, unitPrice: 5.25, total: 10.50 }
    ],
    subtotal: 19.00,
    taxAmount: 1.33,
    discountAmount: 0.00,
    total: 20.33,
    paymentMethod: "card",
    cashierName: "Sophie"
  },
  {
    id: "tx-303",
    receiptNumber: "REC-1083",
    timestamp: "2026-09-24 08:20",
    items: [
      { productId: "prod-4", productName: "Rosemary & Kalamata Focaccia", quantity: 2, unitPrice: 6.25, total: 12.50 },
      { productId: "prod-9", productName: "Pour-Over Filter Coffee", quantity: 2, unitPrice: 4.50, total: 9.00 }
    ],
    subtotal: 21.50,
    taxAmount: 1.51,
    discountAmount: 0.00,
    total: 23.01,
    paymentMethod: "cash",
    amountTendered: 30.00,
    changeGiven: 6.99,
    cashierName: "Sophie"
  }
];

export const INITIAL_WASTE_RECORDS: WasteRecord[] = [
  {
    id: "wst-01",
    date: "2026-09-23",
    productId: "prod-1",
    productName: "Artisan Country Sourdough",
    quantity: 2,
    reason: "repurposed",
    unitCost: 1.45,
    totalLoss: 2.90,
    notes: "Sliced and dehydrated for house garlic sourdough croutons."
  },
  {
    id: "wst-02",
    date: "2026-09-23",
    productId: "prod-2",
    productName: "French Butter Croissant",
    quantity: 4,
    reason: "repurposed",
    unitCost: 1.15,
    totalLoss: 4.60,
    notes: "Dipped in rum syrup & almond frangipane for tomorrow's Almond Croissants."
  },
  {
    id: "wst-03",
    date: "2026-09-23",
    productId: "prod-4",
    productName: "Rosemary & Kalamata Focaccia",
    quantity: 2,
    reason: "donated",
    unitCost: 1.20,
    totalLoss: 2.40,
    notes: "Donated to City Harvest evening pantry run."
  }
];
