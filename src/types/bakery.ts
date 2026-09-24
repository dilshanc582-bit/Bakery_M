export type ProductCategory = 
  | 'breads'
  | 'viennoiserie'
  | 'patisserie'
  | 'savory'
  | 'beverages';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stock: number;
  minStockAlert: number;
  recipeId?: string;
  image?: string;
  description: string;
  allergens: string[];
  isAvailable: boolean;
  dailyTarget: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'flour' | 'dairy' | 'sweeteners' | 'fats' | 'inclusions' | 'leaven' | 'packaging' | 'other';
  currentStock: number;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'pcs';
  reorderLevel: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number; // in recipe's base unit (grams, ml, or pcs)
  unit: string;
  isFlour?: boolean; // Used for Baker's % calculation
}

export interface Recipe {
  id: string;
  name: string;
  category: ProductCategory;
  baseYield: number; // e.g. 12 loaves
  yieldUnit: string;
  preparationMinutes: number;
  bakeMinutes: number;
  bakeTempC: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  bakerNotes?: string;
}

export type BatchStage = 
  | 'scheduled'
  | 'mixing'
  | 'proofing'
  | 'baking'
  | 'cooling'
  | 'ready'
  | 'completed';

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  recipeId: string;
  recipeName: string;
  scheduledTime: string; // e.g. "04:30"
  targetYield: number;
  actualYield?: number;
  wasteYield?: number;
  stage: BatchStage;
  startTime?: string;
  endTime?: string;
  timerMinutesRemaining?: number;
  timerRunning?: boolean;
  notes?: string;
  assignedBaker?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  specialNote?: string;
  unitPrice: number;
}

export type PaymentMethod = 'cash' | 'card' | 'contactless' | 'prepaid';

export interface SaleTransaction {
  id: string;
  receiptNumber: string;
  timestamp: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    selectedOption?: string;
  }[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountTendered?: number;
  changeGiven?: number;
  cashierName: string;
}

export type OrderStatus = 'inquiry' | 'confirmed' | 'in_prep' | 'ready' | 'completed' | 'cancelled';

export interface CustomOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  itemsDescription: string;
  specialInstructions?: string;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  status: OrderStatus;
  createdAt: string;
}

export interface WasteRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: 'unsold_stale' | 'burnt_damaged' | 'sample_tasting' | 'repurposed' | 'donated';
  unitCost: number;
  totalLoss: number;
  notes?: string;
}

export interface BakerySettings {
  bakeryName: string;
  tagline: string;
  address: string;
  phone: string;
  taxRate: number; // e.g. 0.08 for 8%
  currencySymbol: string;
  receiptFooterNote: string;
  morningBakeStart: string;
}
