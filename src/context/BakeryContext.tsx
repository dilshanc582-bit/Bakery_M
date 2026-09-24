import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Ingredient, 
  Recipe, 
  ProductionBatch, 
  CustomOrder, 
  SaleTransaction, 
  WasteRecord, 
  BakerySettings,
  CartItem,
  PaymentMethod,
  BatchStage,
  OrderStatus
} from '../types/bakery';
import {
  INITIAL_SETTINGS,
  INITIAL_INGREDIENTS,
  INITIAL_RECIPES,
  INITIAL_PRODUCTS,
  INITIAL_BATCHES,
  INITIAL_CUSTOM_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_WASTE_RECORDS
} from '../data/initialData';

export type NavigationTab = 
  | 'dashboard'
  | 'pos'
  | 'production'
  | 'recipes'
  | 'inventory'
  | 'orders'
  | 'waste'
  | 'reports';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface BakeryContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  settings: BakerySettings;
  updateSettings: (newSettings: Partial<BakerySettings>) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustProductStock: (id: string, delta: number) => void;
  
  // Ingredients
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'lastRestocked'>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  receiveIngredientDelivery: (id: string, addedStock: number, unitCost?: number) => void;
  lowStockIngredients: Ingredient[];
  
  // Recipes
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  calculateRecipeCost: (recipe: Recipe) => { totalCost: number; costPerUnit: number };
  
  // Production Batches
  batches: ProductionBatch[];
  addBatch: (batch: Omit<ProductionBatch, 'id' | 'batchNumber'>) => void;
  updateBatchStage: (id: string, newStage: BatchStage, actualYield?: number, wasteYield?: number) => void;
  toggleBatchTimer: (id: string) => void;
  resetBatchTimer: (id: string, minutes: number) => void;
  sendBatchToCounter: (batchId: string) => void;
  
  // Point of Sale (POS)
  cart: CartItem[];
  addToCart: (product: Product, option?: string, note?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  completeSale: (
    paymentMethod: PaymentMethod, 
    discount?: number, 
    tendered?: number, 
    cashierName?: string
  ) => SaleTransaction;
  
  // Sales History & Receipts
  transactions: SaleTransaction[];
  selectedReceipt: SaleTransaction | null;
  setSelectedReceipt: (tx: SaleTransaction | null) => void;
  
  // Custom Orders
  customOrders: CustomOrder[];
  addCustomOrder: (order: Omit<CustomOrder, 'id' | 'orderNumber' | 'createdAt' | 'balanceDue'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  recordOrderPayment: (id: string, additionalPayment: number) => void;
  
  // Waste Management
  wasteRecords: WasteRecord[];
  logWaste: (record: Omit<WasteRecord, 'id'>) => void;
  
  // Backup / Reset
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  // State with localStorage hydration
  const [settings, setSettings] = useState<BakerySettings>(() => {
    const saved = localStorage.getItem('bakery_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bakery_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('bakery_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('bakery_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [batches, setBatches] = useState<ProductionBatch[]>(() => {
    const saved = localStorage.getItem('bakery_batches');
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => {
    const saved = localStorage.getItem('bakery_custom_orders');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_ORDERS;
  });

  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => {
    const saved = localStorage.getItem('bakery_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    const saved = localStorage.getItem('bakery_waste_records');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_RECORDS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<SaleTransaction | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const addToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bakery_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bakery_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bakery_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('bakery_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('bakery_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('bakery_custom_orders', JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem('bakery_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bakery_waste_records', JSON.stringify(wasteRecords));
  }, [wasteRecords]);

  // Production Timers countdown tick (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setBatches(prevBatches => {
        let changed = false;
        const updated = prevBatches.map(b => {
          if (b.timerRunning && b.timerMinutesRemaining && b.timerMinutesRemaining > 0) {
            changed = true;
            const newMinutes = Math.max(0, Math.round((b.timerMinutesRemaining - (1 / 60)) * 100) / 100);
            return {
              ...b,
              timerMinutesRemaining: newMinutes,
              timerRunning: newMinutes > 0
            };
          }
          return b;
        });
        return changed ? updated : prevBatches;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Settings update
  const updateSettings = (newSettings: Partial<BakerySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Bakery preferences saved', 'info');
  };

  // Products methods
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast(`Added ${newProduct.name} to bakery catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast('Product updated');
  };

  const adjustProductStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Ingredients methods
  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'lastRestocked'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newIng: Ingredient = {
      ...ingredient,
      id: `ing-${Date.now()}`,
      lastRestocked: today
    };
    setIngredients(prev => [...prev, newIng]);
    addToast(`Added ingredient: ${newIng.name}`);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    addToast('Ingredient record updated');
  };

  const receiveIngredientDelivery = (id: string, addedStock: number, unitCost?: number) => {
    const today = new Date().toISOString().split('T')[0];
    setIngredients(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          currentStock: i.currentStock + addedStock,
          costPerUnit: unitCost !== undefined ? unitCost : i.costPerUnit,
          lastRestocked: today
        };
      }
      return i;
    }));
    addToast(`Received +${addedStock} delivery for ingredient`);
  };

  const lowStockIngredients = ingredients.filter(i => i.currentStock <= i.reorderLevel);

  // Recipes methods
  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `rec-${Date.now()}`
    };
    setRecipes(prev => [...prev, newRecipe]);
    addToast(`Saved formula: ${newRecipe.name}`);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addToast('Recipe formula updated');
  };

  const calculateRecipeCost = (recipe: Recipe) => {
    let totalCost = 0;
    recipe.ingredients.forEach(item => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (ing) {
        // Handle units: grams vs kg, ml vs L
        let multiplier = 1;
        if (ing.unit === 'kg' && item.unit === 'g') {
          multiplier = item.amount / 1000;
        } else if (ing.unit === 'L' && item.unit === 'ml') {
          multiplier = item.amount / 1000;
        } else {
          multiplier = item.amount;
        }
        totalCost += ing.costPerUnit * multiplier;
      }
    });
    const costPerUnit = recipe.baseYield > 0 ? totalCost / recipe.baseYield : 0;
    return {
      totalCost: Math.round(totalCost * 100) / 100,
      costPerUnit: Math.round(costPerUnit * 100) / 100
    };
  };

  // Batches methods
  const addBatch = (batch: Omit<ProductionBatch, 'id' | 'batchNumber'>) => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = batches.length + 1;
    const batchNumber = `B-${dateStr}-${count.toString().padStart(2, '0')}`;
    
    const newBatch: ProductionBatch = {
      ...batch,
      id: `batch-${Date.now()}`,
      batchNumber
    };

    // If batch starts in mixing/proofing, deduct raw ingredients automatically!
    const recipe = recipes.find(r => r.id === batch.recipeId);
    if (recipe && recipe.baseYield > 0) {
      const scaleFactor = batch.targetYield / recipe.baseYield;
      setIngredients(prev => prev.map(ing => {
        const req = recipe.ingredients.find(ri => ri.ingredientId === ing.id);
        if (!req) return ing;

        let deductAmount = req.amount * scaleFactor;
        if (ing.unit === 'kg' && req.unit === 'g') {
          deductAmount = deductAmount / 1000;
        } else if (ing.unit === 'L' && req.unit === 'ml') {
          deductAmount = deductAmount / 1000;
        }

        const remaining = Math.max(0, Math.round((ing.currentStock - deductAmount) * 100) / 100);
        return { ...ing, currentStock: remaining };
      }));
    }

    setBatches(prev => [newBatch, ...prev]);
    addToast(`Scheduled batch ${batchNumber}: ${batch.recipeName}`);
  };

  const updateBatchStage = (id: string, newStage: BatchStage, actualYield?: number, wasteYield?: number) => {
    setBatches(prev => prev.map(b => {
      if (b.id === id) {
        const updates: Partial<ProductionBatch> = { stage: newStage };
        if (actualYield !== undefined) updates.actualYield = actualYield;
        if (wasteYield !== undefined) updates.wasteYield = wasteYield;
        if (newStage === 'baking' && !b.timerMinutesRemaining) {
          const recipe = recipes.find(r => r.id === b.recipeId);
          updates.timerMinutesRemaining = recipe?.bakeMinutes || 25;
          updates.timerRunning = true;
          updates.startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (newStage === 'ready' || newStage === 'completed') {
          updates.timerRunning = false;
          updates.endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return { ...b, ...updates };
      }
      return b;
    }));
    addToast(`Batch stage updated to ${newStage.toUpperCase()}`);
  };

  const toggleBatchTimer = (id: string) => {
    setBatches(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, timerRunning: !b.timerRunning };
      }
      return b;
    }));
  };

  const resetBatchTimer = (id: string, minutes: number) => {
    setBatches(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, timerMinutesRemaining: minutes, timerRunning: true };
      }
      return b;
    }));
    addToast(`Timer reset to ${minutes} mins`);
  };

  const sendBatchToCounter = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const yieldQty = batch.actualYield !== undefined ? batch.actualYield : batch.targetYield;
    // Find matching product
    const matchingProduct = products.find(p => p.recipeId === batch.recipeId);
    if (matchingProduct) {
      adjustProductStock(matchingProduct.id, yieldQty);
      updateBatchStage(batchId, 'completed');
      addToast(`Added +${yieldQty} fresh ${matchingProduct.name} to POS counter stock!`);
    } else {
      updateBatchStage(batchId, 'completed');
      addToast(`Batch marked completed (${yieldQty} units). No direct POS item linked.`);
    }
  };

  // Cart & POS
  const addToCart = (product: Product, option?: string, note?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedOption === option && item.specialNote === note
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1
        };
        return next;
      } else {
        return [...prev, {
          product,
          quantity: 1,
          selectedOption: option,
          specialNote: note,
          unitPrice: product.price
        }];
      }
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(prev => {
        const next = [...prev];
        next[index] = { ...next[index], quantity };
        return next;
      });
    }
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = Math.round(cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) * 100) / 100;
  const cartTax = Math.round((cartSubtotal * settings.taxRate) * 100) / 100;
  const cartTotal = Math.round((cartSubtotal + cartTax) * 100) / 100;

  const completeSale = (
    paymentMethod: PaymentMethod,
    discount: number = 0,
    tendered?: number,
    cashierName: string = "Baker Sophie"
  ): SaleTransaction => {
    const discountedSubtotal = Math.max(0, cartSubtotal - discount);
    const tax = Math.round((discountedSubtotal * settings.taxRate) * 100) / 100;
    const finalTotal = Math.round((discountedSubtotal + tax) * 100) / 100;
    
    const date = new Date();
    const timeStr = `${date.toISOString().slice(0, 10)} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const receiptNumber = `REC-${(1000 + transactions.length + 1).toString()}`;

    const tx: SaleTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber,
      timestamp: timeStr,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: Math.round(item.unitPrice * item.quantity * 100) / 100,
        selectedOption: item.selectedOption
      })),
      subtotal: discountedSubtotal,
      taxAmount: tax,
      discountAmount: discount,
      total: finalTotal,
      paymentMethod,
      amountTendered: tendered,
      changeGiven: tendered && tendered >= finalTotal ? Math.round((tendered - finalTotal) * 100) / 100 : undefined,
      cashierName
    };

    // Decrement sold stock for inventory
    cart.forEach(item => {
      adjustProductStock(item.product.id, -item.quantity);
    });

    setTransactions(prev => [tx, ...prev]);
    setCart([]);
    setSelectedReceipt(tx);
    addToast(`Sale ${receiptNumber} complete (${settings.currencySymbol}${finalTotal.toFixed(2)})`);

    return tx;
  };

  // Custom Orders
  const addCustomOrder = (order: Omit<CustomOrder, 'id' | 'orderNumber' | 'createdAt' | 'balanceDue'>) => {
    const orderNumber = `ORD-${(940 + customOrders.length + 1).toString()}`;
    const today = new Date().toISOString().split('T')[0];
    const balanceDue = Math.max(0, Math.round((order.totalAmount - order.depositPaid) * 100) / 100);

    const newOrder: CustomOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber,
      balanceDue,
      createdAt: today
    };

    setCustomOrders(prev => [newOrder, ...prev]);
    addToast(`Custom order ${orderNumber} created for ${order.customerName}`);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setCustomOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addToast(`Order status marked: ${status.replace('_', ' ').toUpperCase()}`);
  };

  const recordOrderPayment = (id: string, additionalPayment: number) => {
    setCustomOrders(prev => prev.map(o => {
      if (o.id === id) {
        const newDeposit = o.depositPaid + additionalPayment;
        const newBalance = Math.max(0, o.totalAmount - newDeposit);
        return {
          ...o,
          depositPaid: newDeposit,
          balanceDue: newBalance
        };
      }
      return o;
    }));
    addToast(`Payment of ${settings.currencySymbol}${additionalPayment.toFixed(2)} recorded`);
  };

  // Waste Management
  const logWaste = (record: Omit<WasteRecord, 'id'>) => {
    const newWaste: WasteRecord = {
      ...record,
      id: `wst-${Date.now()}`
    };
    setWasteRecords(prev => [newWaste, ...prev]);

    // If unsold or discarded, reduce stock
    if (record.reason !== 'repurposed') {
      adjustProductStock(record.productId, -record.quantity);
    }

    addToast(`Logged ${record.quantity}x ${record.productName} (${record.reason})`);
  };

  // Reset & Backup
  const resetAllData = () => {
    setSettings(INITIAL_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setIngredients(INITIAL_INGREDIENTS);
    setRecipes(INITIAL_RECIPES);
    setBatches(INITIAL_BATCHES);
    setCustomOrders(INITIAL_CUSTOM_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWasteRecords(INITIAL_WASTE_RECORDS);
    setCart([]);
    addToast('Reset to demo artisan bakery data', 'info');
  };

  const exportDataJSON = () => {
    const data = {
      settings,
      products,
      ingredients,
      recipes,
      batches,
      customOrders,
      transactions,
      wasteRecords,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.products) setProducts(data.products);
      if (data.ingredients) setIngredients(data.ingredients);
      if (data.recipes) setRecipes(data.recipes);
      if (data.batches) setBatches(data.batches);
      if (data.customOrders) setCustomOrders(data.customOrders);
      if (data.transactions) setTransactions(data.transactions);
      if (data.wasteRecords) setWasteRecords(data.wasteRecords);
      addToast('Data successfully imported!', 'success');
      return true;
    } catch {
      addToast('Invalid backup file format', 'error');
      return false;
    }
  };

  return (
    <BakeryContext.Provider value={{
      activeTab,
      setActiveTab,
      settings,
      updateSettings,
      products,
      addProduct,
      updateProduct,
      adjustProductStock,
      ingredients,
      addIngredient,
      updateIngredient,
      receiveIngredientDelivery,
      lowStockIngredients,
      recipes,
      addRecipe,
      updateRecipe,
      calculateRecipeCost,
      batches,
      addBatch,
      updateBatchStage,
      toggleBatchTimer,
      resetBatchTimer,
      sendBatchToCounter,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartTax,
      cartTotal,
      completeSale,
      transactions,
      selectedReceipt,
      setSelectedReceipt,
      customOrders,
      addCustomOrder,
      updateOrderStatus,
      recordOrderPayment,
      wasteRecords,
      logWaste,
      resetAllData,
      exportDataJSON,
      importDataJSON,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
