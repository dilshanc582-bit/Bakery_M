import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Settings, Download, Upload, RotateCcw, X, Check, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    updateSettings, 
    resetAllData, 
    exportDataJSON, 
    importDataJSON 
  } = useBakery();

  const [formData, setFormData] = useState({ ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crumb_and_crust_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importJsonText.trim()) {
      const ok = importDataJSON(importJsonText);
      if (ok) {
        setShowImportBox(false);
        setImportJsonText('');
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-mono uppercase text-amber-800">System Preferences</span>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Bakery Shop Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Bakery Name
            </label>
            <input
              type="text"
              required
              value={formData.bakeryName}
              onChange={(e) => setFormData({ ...formData, bakeryName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Shop Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Telephone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Sales Tax Rate
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="0.5"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:outline-none"
              />
              <span className="text-[10px] text-stone-400">e.g. 0.07 for 7%</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Morning Bake Time
              </label>
              <input
                type="time"
                value={formData.morningBakeStart}
                onChange={(e) => setFormData({ ...formData, morningBakeStart: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Receipt Footer Note
            </label>
            <textarea
              rows={2}
              value={formData.receiptFooterNote}
              onChange={(e) => setFormData({ ...formData, receiptFooterNote: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>

        {/* Data Backup & Restore */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Data Backup & System Maintenance
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={() => setShowImportBox(!showImportBox)}
              className="px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset all bakery data back to default demo state?')) {
                  resetAllData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg flex items-center gap-1.5 ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          {showImportBox && (
            <form onSubmit={handleImportSubmit} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="text-[11px] font-semibold text-stone-700 block">
                Paste JSON Backup Content Below:
              </label>
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"settings": {...}, "products": [...]}'
                className="w-full p-2 text-xs font-mono bg-white border border-stone-300 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportBox(false)}
                  className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded"
                >
                  Apply Backup
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
