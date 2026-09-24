import React from 'react';
import { useBakery, NavigationTab } from '../context/BakeryContext';
import { ShoppingBag, Flame, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenNewBatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenNewBatch }) => {
  const { activeTab, setActiveTab, cart, lowStockIngredients, settings } = useBakery();

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'pos', label: 'Counter POS' },
    { id: 'production', label: 'Bakehouse' },
    { id: 'recipes', label: 'Formulas' },
    { id: 'inventory', label: 'Pantry' },
    { id: 'orders', label: 'Pre-Orders' },
    { id: 'waste', label: 'Daily Waste' },
    { id: 'reports', label: 'Reports' },
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
              {settings.bakeryName}
            </span>
          </button>

          {/* Zone 2: Navigation Links (Single-line, clean text with subtle active state) */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap relative rounded-md ${
                    isActive
                      ? 'text-stone-950 font-semibold bg-stone-100'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                  {item.id === 'pos' && totalCartCount > 0 && (
                    <span className="ml-1.5 text-xs text-amber-800 font-mono font-bold">
                      ({totalCartCount})
                    </span>
                  )}
                  {item.id === 'inventory' && lowStockIngredients.length > 0 && (
                    <span className="ml-1.5 text-xs text-amber-700 font-mono font-medium">
                      · {lowStockIngredients.length} low
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('pos')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'pos'
                  ? 'bg-amber-900 text-white'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>POS Register</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-800 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenNewBatch}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Start Batch</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Bakery Settings & Backup"
              aria-label="Bakery Settings"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex overflow-x-auto py-2 gap-1 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-md ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-50'
                }`}
              >
                {item.label}
                {item.id === 'pos' && totalCartCount > 0 && ` (${totalCartCount})`}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
