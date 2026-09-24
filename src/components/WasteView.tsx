import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { WasteRecord } from '../types/bakery';
import { 
  Recycle, 
  Trash2, 
  HeartHandshake, 
  Plus, 
  DollarSign, 
  Sparkles, 
  AlertCircle,
  X
} from 'lucide-react';

export const WasteView: React.FC = () => {
  const { 
    wasteRecords, 
    logWaste, 
    products, 
    settings 
  } = useBakery();

  const [isLogWasteOpen, setIsLogWasteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [wasteQty, setWasteQty] = useState<number>(3);
  const [wasteReason, setWasteReason] = useState<WasteRecord['reason']>('repurposed');
  const [wasteNotes, setWasteNotes] = useState<string>('Dipped in syrup and frangipane for tomorrow almond croissants');

  const totalWasteLoss = wasteRecords.reduce((sum, item) => sum + item.totalLoss, 0);
  const repurposedCount = wasteRecords.filter(r => r.reason === 'repurposed').reduce((sum, r) => sum + r.quantity, 0);
  const donatedCount = wasteRecords.filter(r => r.reason === 'donated').reduce((sum, r) => sum + r.quantity, 0);

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    // Unit cost estimation: approx 25% of retail price
    const estimatedCost = Math.round(prod.price * 0.25 * 100) / 100;
    const totalLoss = Math.round(estimatedCost * wasteQty * 100) / 100;

    logWaste({
      date: new Date().toISOString().slice(0, 10),
      productId: prod.id,
      productName: prod.name,
      quantity: wasteQty,
      reason: wasteReason,
      unitCost: estimatedCost,
      totalLoss: wasteReason === 'repurposed' ? 0 : totalLoss,
      notes: wasteNotes || undefined
    });

    setIsLogWasteOpen(false);
  };

  const getReasonBadge = (reason: WasteRecord['reason']) => {
    switch (reason) {
      case 'repurposed':
        return (
          <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            <Recycle className="w-3 h-3 text-emerald-600" />
            Repurposed (Value Saved)
          </span>
        );
      case 'donated':
        return (
          <span className="flex items-center gap-1 font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
            <HeartHandshake className="w-3 h-3 text-blue-600" />
            Community Donation
          </span>
        );
      case 'unsold_stale':
        return (
          <span className="font-mono text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
            Unsold / Stale
          </span>
        );
      case 'burnt_damaged':
        return (
          <span className="font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
            Oven Scorched / Scrap
          </span>
        );
      case 'sample_tasting':
        return (
          <span className="font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
            Counter Tasting Samples
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Daily Shrinkage & Upcycling</span>
            <span aria-hidden="true">·</span>
            <span>Food Waste Minimization & Pantry Donations</span>
            <span aria-hidden="true">·</span>
            <span>End-of-day audit</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Wastage, Repurposing & Shrinkage
          </h1>
        </div>

        <button
          onClick={() => setIsLogWasteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Unsold / Waste Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Repurposed Bakes (Value Saved)</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1 flex items-center gap-2">
            <span>{repurposedCount}</span>
            <span className="text-xs font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Zero loss
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Transformed into almond croissants, breadcrumbs, croutons
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Community Pantry Donations</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {donatedCount} <span className="text-sm font-normal text-stone-500 font-sans">units</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Donated to local shelters & food banks
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Net Cost of Discarded Loss</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{totalWasteLoss.toFixed(2)}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Ingredient input cost of unrecoverable items
          </div>
        </div>

      </div>

      {/* Waste Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Product</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Estimated Cost</th>
                <th className="py-3 px-4 text-right">Net Financial Loss</th>
                <th className="py-3 px-4">Baker's Upcycle Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {wasteRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center font-sans text-stone-400">
                    No waste or unsold shrinkage logged yet.
                  </td>
                </tr>
              ) : (
                wasteRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-stone-900 text-sm">{item.productName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{item.date}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 tabular-nums text-sm">
                      {item.quantity} units
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      {getReasonBadge(item.reason)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-stone-500 tabular-nums">
                      {settings.currencySymbol}{item.unitCost.toFixed(2)}/unit
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 tabular-nums">
                      {item.totalLoss > 0 ? (
                        <span className="text-amber-900">
                          {settings.currencySymbol}{item.totalLoss.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-sans text-xs">
                          {settings.currencySymbol}0.00 (Recouped)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-sans text-stone-600 text-xs italic">
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Waste Modal */}
      {isLogWasteOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Close of Day Audit</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Log Unsold or Waste Items
                </h3>
              </div>
              <button
                onClick={() => setIsLogWasteOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogWaste} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({settings.currencySymbol}{p.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Unsold Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={wasteQty}
                    onChange={(e) => setWasteQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Handling Action
                  </label>
                  <select
                    value={wasteReason}
                    onChange={(e) => setWasteReason(e.target.value as WasteRecord['reason'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none"
                  >
                    <option value="repurposed">Repurpose (Almond croissant, croutons)</option>
                    <option value="donated">Donate to Shelter / Food Bank</option>
                    <option value="sample_tasting">Counter Samples / Tasting</option>
                    <option value="unsold_stale">Stale (Discarded)</option>
                    <option value="burnt_damaged">Damaged / Oven Scrap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Upcycling Notes / Reason Details
                </label>
                <input
                  type="text"
                  value={wasteNotes}
                  onChange={(e) => setWasteNotes(e.target.value)}
                  placeholder="e.g. Day-old croissants dipped in almond syrup"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsLogWasteOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg"
                >
                  Record Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
