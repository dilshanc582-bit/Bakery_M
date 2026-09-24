import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Ingredient } from '../types/bakery';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Truck, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  X,
  SlidersHorizontal
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { 
    ingredients, 
    lowStockIngredients, 
    receiveIngredientDelivery, 
    updateIngredient, 
    addIngredient, 
    settings 
  } = useBakery();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Receive delivery modal
  const [deliveryIngredient, setDeliveryIngredient] = useState<Ingredient | null>(null);
  const [addedStock, setAddedStock] = useState<number>(25);
  const [deliveryCost, setDeliveryCost] = useState<number>(0);

  // Add new ingredient modal
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Ingredient['category']>('flour');
  const [newStock, setNewStock] = useState(50);
  const [newUnit, setNewUnit] = useState<Ingredient['unit']>('kg');
  const [newReorder, setNewReorder] = useState(20);
  const [newCost, setNewCost] = useState(2.00);
  const [newSupplier, setNewSupplier] = useState('');

  // Total inventory valuation
  const totalValuation = ingredients.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  const filteredIngredients = ingredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'low_stock') return item.currentStock <= item.reorderLevel;
    return item.category === selectedFilter;
  });

  const handleOpenReceive = (item: Ingredient) => {
    setDeliveryIngredient(item);
    setAddedStock(item.reorderLevel);
    setDeliveryCost(item.costPerUnit);
  };

  const handleConfirmReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryIngredient && addedStock > 0) {
      receiveIngredientDelivery(deliveryIngredient.id, addedStock, deliveryCost);
      setDeliveryIngredient(null);
    }
  };

  const handleCreateIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addIngredient({
      name: newName,
      category: newCategory,
      currentStock: newStock,
      unit: newUnit,
      reorderLevel: newReorder,
      costPerUnit: newCost,
      supplier: newSupplier || 'Local Bakery Supply'
    });

    setIsAddIngredientOpen(false);
    setNewName('');
    setNewSupplier('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Pantry & Raw Materials</span>
            <span aria-hidden="true">·</span>
            <span>Organic Flours, Cultured Butters & Packaging</span>
            <span aria-hidden="true">·</span>
            <span>{ingredients.length} active SKUs</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Raw Ingredient & Packaging Inventory
          </h1>
        </div>

        <button
          onClick={() => setIsAddIngredientOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Raw Material</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Total Pantry Asset Value</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{totalValuation.toFixed(2)}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Based on current supplier unit purchase costs
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Low Stock Reorder Alerts</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1 flex items-center gap-2">
            <span>{lowStockIngredients.length}</span>
            {lowStockIngredients.length > 0 && (
              <span className="text-xs font-sans font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Action required
              </span>
            )}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Items currently at or below minimum safety levels
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Pantry Categories</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            8 <span className="text-sm font-normal text-stone-500 font-sans">categories</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Flours, dairy, inclusions, packaging & leavens
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flour, butter, yeast, supplier..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-800"
          />
        </div>

        {/* Filter Pills / Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'low_stock', label: `Low Stock (${lowStockIngredients.length})` },
            { id: 'flour', label: 'Flours & Grains' },
            { id: 'dairy', label: 'Dairy & Eggs' },
            { id: 'inclusions', label: 'Inclusions & Fruits' },
            { id: 'packaging', label: 'Packaging' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setSelectedFilter(flt.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === flt.id
                  ? 'bg-amber-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Raw Material & Category</th>
                <th className="py-3 px-4 text-right">In Stock</th>
                <th className="py-3 px-4 text-right">Reorder Threshold</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Asset Value</th>
                <th className="py-3 px-4">Supplier & Last Restock</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center font-sans text-stone-400">
                    No ingredients found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((item) => {
                  const isLow = item.currentStock <= item.reorderLevel;
                  const itemValue = item.currentStock * item.costPerUnit;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isLow ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-semibold text-stone-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
                          {item.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-stone-900 tabular-nums text-sm">
                        {item.currentStock} {item.unit}
                      </td>

                      <td className="py-3.5 px-4 text-right text-stone-500 tabular-nums">
                        {item.reorderLevel} {item.unit}
                        {isLow && (
                          <span className="block text-[10px] text-amber-800 font-sans font-bold">
                            Safety level breached
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right text-stone-600 tabular-nums">
                        {settings.currencySymbol}{item.costPerUnit.toFixed(2)}/{item.unit}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-stone-900 tabular-nums">
                        {settings.currencySymbol}{itemValue.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 font-sans text-xs">
                        <div className="text-stone-800 font-medium">{item.supplier}</div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          Last delivery: {item.lastRestocked}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-sans">
                        <button
                          onClick={() => handleOpenReceive(item)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-800 hover:bg-amber-900 text-white transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Receive</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Delivery Modal */}
      {deliveryIngredient && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Inventory Delivery</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Receive {deliveryIngredient.name}
                </h3>
              </div>
              <button
                onClick={() => setDeliveryIngredient(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceive} className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                Current Stock: <strong className="font-mono text-stone-900">{deliveryIngredient.currentStock} {deliveryIngredient.unit}</strong> · Supplier: <strong>{deliveryIngredient.supplier}</strong>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Received Quantity (+{deliveryIngredient.unit})
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={addedStock}
                  onChange={(e) => setAddedStock(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Invoice Unit Cost ({settings.currencySymbol}/{deliveryIngredient.unit})
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setDeliveryIngredient(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Confirm Shipment Received
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Add New Raw Material Modal */}
      {isAddIngredientOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Pantry Master</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Register New Raw Material
                </h3>
              </div>
              <button
                onClick={() => setIsAddIngredientOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIngredient} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Material Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Organic Rolled Oat Flakes"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Ingredient['category'])}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  >
                    <option value="flour">Flours & Grains</option>
                    <option value="dairy">Dairy & Eggs</option>
                    <option value="fats">Fats & Oils</option>
                    <option value="sweeteners">Sweeteners</option>
                    <option value="inclusions">Inclusions & Fruits</option>
                    <option value="leaven">Yeast & Leaven</option>
                    <option value="packaging">Packaging & Bags</option>
                    <option value="other">Other / Spices</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Measurement Unit
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as Ingredient['unit'])}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="g">g (Grams)</option>
                    <option value="L">L (Liters)</option>
                    <option value="ml">ml (Milliliters)</option>
                    <option value="pcs">pcs (Pieces / Boxes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newStock}
                    onChange={(e) => setNewStock(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Reorder Alert Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={newReorder}
                    onChange={(e) => setNewReorder(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Cost / Unit ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newCost}
                    onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Primary Supplier / Mill
                </label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  placeholder="e.g. Valley Organic Millers"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddIngredientOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg"
                >
                  Save Material
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
