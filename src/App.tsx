/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { POSView } from './components/POSView';
import { ProductionView } from './components/ProductionView';
import { RecipesView } from './components/RecipesView';
import { InventoryView } from './components/InventoryView';
import { PreOrdersView } from './components/PreOrdersView';
import { WasteView } from './components/WasteView';
import { ReportsView } from './components/ReportsView';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/ToastContainer';

const BakeryAppContent: React.FC = () => {
  const { activeTab } = useBakery();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Bar adhering to Top Bar Contract */}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNewBatch={() => setIsNewBatchModalOpen(true)}
      />

      {/* Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onOpenNewBatch={() => setIsNewBatchModalOpen(true)}
            onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
          />
        )}
        {activeTab === 'pos' && <POSView />}
        {activeTab === 'production' && (
          <ProductionView 
            isNewBatchModalOpen={isNewBatchModalOpen}
            setIsNewBatchModalOpen={setIsNewBatchModalOpen}
          />
        )}
        {activeTab === 'recipes' && <RecipesView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'orders' && (
          <PreOrdersView 
            isNewOrderModalOpen={isNewOrderModalOpen}
            setIsNewOrderModalOpen={setIsNewOrderModalOpen}
          />
        )}
        {activeTab === 'waste' && <WasteView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Modals & Overlays */}
      <ReceiptModal />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <BakeryAppContent />
    </BakeryProvider>
  );
}
