import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Product, ProductCategory, PaymentMethod } from '../types/bakery';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Check, 
  ShoppingBag,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const POSView: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    cartTax, 
    cartTotal,
    completeSale,
    settings
  } = useBakery();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<Product | null>(null);
  const [customOption, setCustomOption] = useState('Whole (Uncut)');
  const [customNote, setCustomNote] = useState('');

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('contactless');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [cashierName, setCashierName] = useState<string>('Baker Sophie');

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'breads', label: 'Artisan Breads' },
    { id: 'viennoiserie', label: 'Viennoiserie' },
    { id: 'patisserie', label: 'Patisserie & Tarts' },
    { id: 'savory', label: 'Savory Bakes' },
    { id: 'beverages', label: 'Coffee & Drinks' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.category === 'breads') {
      // Open bread slicing options
      setSelectedProductForOptions(product);
      setCustomOption('Whole (Uncut)');
      setCustomNote('');
    } else {
      addToCart(product);
    }
  };

  const handleConfirmWithOptions = () => {
    if (selectedProductForOptions) {
      addToCart(selectedProductForOptions, customOption, customNote || undefined);
      setSelectedProductForOptions(null);
    }
  };

  const finalPayable = Math.max(0, cartTotal - discountAmount);
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = tenderedNum >= finalPayable ? Math.round((tenderedNum - finalPayable) * 100) / 100 : 0;

  const handleFinalizeSale = () => {
    completeSale(
      paymentMethod,
      discountAmount,
      paymentMethod === 'cash' ? tenderedNum : undefined,
      cashierName
    );
    setIsCheckoutOpen(false);
    setCashTendered('');
    setDiscountAmount(0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Area: Catalog & Fast Filter Controls */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden">
        
        {/* Catalog Search & Category Filter Header */}
        <div className="p-4 border-b border-stone-200 space-y-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search breads, croissants, tarts, coffee..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 font-mono hidden sm:block shrink-0">
              {filteredProducts.length} items on counter
            </div>
          </div>

          {/* Category Tabs (Segmented Button Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= product.minStockAlert && product.stock > 0;
              const isOutOfStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  onClick={() => !isOutOfStock && handleProductClick(product)}
                  disabled={isOutOfStock}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-stone-200 hover:border-amber-700 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Product Image Slot with Styled Resilient Fallback */}
                    <div className="w-full aspect-4/3 rounded-lg overflow-hidden bg-stone-100 mb-2.5 relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-2 text-center">
                          <ShoppingBag className="w-6 h-6 stroke-1 mb-1 text-stone-300" />
                          <span className="text-[10px] uppercase font-mono tracking-wider">{product.category}</span>
                        </div>
                      )}

                      {/* Stock Indicator */}
                      <div className="absolute top-2 right-2">
                        {isOutOfStock ? (
                          <span className="bg-stone-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            {product.stock} left
                          </span>
                        ) : product.stock < 100 ? (
                          <span className="bg-stone-900/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            {product.stock} avail
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">
                      {product.category}
                    </div>
                    <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {settings.currencySymbol}{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-400 font-sans">
                      /{product.unit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Area: Counter Register & Cart Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shrink-0">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-bold text-stone-900 text-base">Current Ticket</h2>
            <div className="text-xs text-stone-500 font-mono">
              Cashier: {cashierName}
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-stone-300" />
              <p className="text-sm font-medium text-stone-600">Register ticket is empty</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Tap items on the left to add fresh bakes, pastries, and drinks to this ticket.
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.product.name}</h4>
                    {item.selectedOption && (
                      <span className="text-xs text-stone-500 font-mono block">
                        Prep: {item.selectedOption}
                      </span>
                    )}
                    {item.specialNote && (
                      <span className="text-xs text-amber-800 italic block">
                        "{item.specialNote}"
                      </span>
                    )}
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    {settings.currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-xs">
                  <span className="text-stone-500 font-mono">
                    {settings.currencySymbol}{item.unitPrice.toFixed(2)} each
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(index, item.quantity - 1)}
                      className="p-1 rounded bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-stone-900 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(index, item.quantity + 1)}
                      className="p-1 rounded bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Financial Summary & Checkout Trigger */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 space-y-3">
          <div className="space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{settings.currencySymbol}{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(settings.taxRate * 100).toFixed(0)}%)</span>
              <span className="font-mono tabular-nums">{settings.currencySymbol}{cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-900 text-base">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums">{settings.currencySymbol}{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              cart.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-800 hover:bg-amber-900 text-white'
            }`}
          >
            <Banknote className="w-4 h-4 text-amber-200" />
            <span>Charge {settings.currencySymbol}{cartTotal.toFixed(2)}</span>
          </button>
        </div>

      </div>

      {/* Slicing & Options Modal */}
      {selectedProductForOptions && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {selectedProductForOptions.name}
                </h3>
                <p className="text-xs text-stone-500">Select bread slicing preparation & notes</p>
              </div>
              <button
                onClick={() => setSelectedProductForOptions(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-700 block">Slicing Preference</label>
              <div className="grid grid-cols-2 gap-2">
                {['Whole (Uncut)', 'Sliced (Medium 12mm)', 'Sliced (Thick 16mm)', 'Cut in Half'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCustomOption(opt)}
                    className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                      customOption === opt
                        ? 'border-amber-800 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Double wrap in kraft paper bag"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedProductForOptions(null)}
                className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithOptions}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg"
              >
                Add to Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout & Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Checkout Terminal</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Total Due: {settings.currencySymbol}{finalPayable.toFixed(2)}
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'contactless' as PaymentMethod, label: 'Tap / Mobile', icon: Smartphone },
                  { id: 'card' as PaymentMethod, label: 'Chip Card', icon: CreditCard },
                  { id: 'cash' as PaymentMethod, label: 'Cash Tender', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-amber-800 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash Calculator (if cash selected) */}
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">Cash Received</label>
                  <div className="flex gap-1.5">
                    {[10, 20, 50, 100].map((bill) => (
                      <button
                        key={bill}
                        onClick={() => setCashTendered(bill.toString())}
                        className="px-2.5 py-1 text-xs font-mono font-semibold bg-white border border-stone-200 rounded hover:bg-stone-100"
                      >
                        ${bill}
                      </button>
                    ))}
                    <button
                      onClick={() => setCashTendered(finalPayable.toFixed(2))}
                      className="px-2 py-1 text-[11px] font-mono bg-white border border-stone-200 rounded hover:bg-stone-100"
                    >
                      Exact
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-stone-500">{settings.currencySymbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="Enter amount given by customer"
                    className="flex-1 px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 bg-white"
                  />
                </div>

                <div className="p-3 bg-amber-100/60 rounded-lg flex items-center justify-between text-xs font-medium text-amber-950">
                  <span>Change to Return:</span>
                  <span className="text-base font-mono font-bold text-amber-950 tabular-nums">
                    {settings.currencySymbol}{changeDue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Optional Order Discount */}
            <div className="flex items-center justify-between text-xs text-stone-600">
              <label className="font-medium">Baker's Courtesy Discount:</label>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscountAmount(d)}
                    className={`px-2 py-1 rounded text-xs font-mono ${
                      discountAmount === d
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {d === 0 ? 'None' : `-${settings.currencySymbol}${d}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Payment Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleFinalizeSale}
                disabled={paymentMethod === 'cash' && tenderedNum < finalPayable}
                className={`px-6 py-2.5 text-sm font-semibold rounded-xl text-white transition-all shadow-xs cursor-pointer ${
                  paymentMethod === 'cash' && tenderedNum < finalPayable
                    ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                Complete Transaction
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
