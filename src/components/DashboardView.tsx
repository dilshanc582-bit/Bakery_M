import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  Flame, 
  ShoppingBag, 
  CalendarClock, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewBatch: () => void;
  onOpenNewOrder: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenNewBatch, onOpenNewOrder }) => {
  const { 
    settings, 
    transactions, 
    batches, 
    customOrders, 
    lowStockIngredients, 
    setActiveTab,
    toggleBatchTimer,
    sendBatchToCounter,
    setSelectedReceipt
  } = useBakery();

  // Calculate today's stats
  const todayDateStr = new Date().toISOString().slice(0, 10);
  
  const todayTransactions = transactions.filter(t => t.timestamp.startsWith(todayDateStr));
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);

  const activeBatches = batches.filter(b => b.stage !== 'completed');
  const bakingBatches = batches.filter(b => b.stage === 'baking');
  
  const todayOrders = customOrders.filter(o => o.pickupDate === todayDateStr);
  const pendingOrders = todayOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Shift Operations</span>
            <span aria-hidden="true">·</span>
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span aria-hidden="true">·</span>
            <span>Morning Bake: {settings.morningBakeStart}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight" style={{ textWrap: 'balance' }}>
            Bakehouse Morning Shift & Production Pulse
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-900" />
            <span>Open Register</span>
          </button>
          <button
            onClick={onOpenNewBatch}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Start Batch</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500">
            <span>Today's Counter Sales</span>
            <span className="font-mono text-stone-400">{todayTransactions.length} receipts</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {settings.currencySymbol}{todayRevenue.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-stone-500">
              Avg. ticket {settings.currencySymbol}
              {todayTransactions.length > 0 ? (todayRevenue / todayTransactions.length).toFixed(2) : '0.00'}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>View sales ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Batches in Production */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500">
            <span>Active Bakehouse Batches</span>
            <span className="font-mono text-amber-800">{bakingBatches.length} in oven</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {activeBatches.length} <span className="text-sm font-normal text-stone-500 font-sans">in progress</span>
            </div>
            <div className="mt-1 text-xs text-stone-500">
              {batches.filter(b => b.stage === 'ready').length} batches ready for front counter
            </div>
          </div>
          <button
            onClick={() => setActiveTab('production')}
            className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>Bakehouse schedule</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pre-Orders Today */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500">
            <span>Pre-Orders for Today</span>
            <span className="font-mono text-stone-400">{todayOrders.length} total</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {pendingOrders.length} <span className="text-sm font-normal text-stone-500 font-sans">to fulfill</span>
            </div>
            <div className="mt-1 text-xs text-stone-500">
              {todayOrders.filter(o => o.status === 'ready').length} ready for customer pickup
            </div>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>Open reservations</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500">
            <span>Pantry & Ingredients</span>
            {lowStockIngredients.length > 0 ? (
              <span className="text-xs font-medium text-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {lowStockIngredients.length} low
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-700">Nominal</span>
            )}
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
              {lowStockIngredients.length > 0 ? lowStockIngredients.length : '0'}{' '}
              <span className="text-sm font-normal text-stone-500 font-sans">
                {lowStockIngredients.length === 1 ? 'item requires reorder' : 'items require reorder'}
              </span>
            </div>
            <div className="mt-1 text-xs text-stone-500 truncate">
              {lowStockIngredients.length > 0
                ? lowStockIngredients.map(i => i.name.split(' ')[0]).join(', ')
                : 'All raw materials above minimum safety buffer'}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>Review pantry</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Live Oven & Bakehouse Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Live Kitchen & Oven Batches</h2>
              <p className="text-xs text-stone-500 mt-0.5">Real-time status of proofing, baking, and cooling trays</p>
            </div>
            <button
              onClick={() => setActiveTab('production')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Full Production Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeBatches.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200">
                <p className="text-stone-500 text-sm">No batches currently in the ovens or proofers.</p>
                <button
                  onClick={onOpenNewBatch}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-amber-800 rounded-lg hover:bg-amber-900 cursor-pointer"
                >
                  Schedule Next Bake Batch
                </button>
              </div>
            ) : (
              activeBatches.map((batch) => {
                const isBaking = batch.stage === 'baking';
                const isReady = batch.stage === 'ready';

                return (
                  <div
                    key={batch.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-mono font-medium">{batch.batchNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{batch.scheduledTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{batch.assignedBaker || 'Bakery Team'}</span>
                      </div>
                      <h3 className="font-semibold text-stone-900 text-base">{batch.recipeName}</h3>
                      <div className="flex items-center gap-3 text-xs text-stone-600">
                        <span>Target: <strong className="font-mono">{batch.targetYield} units</strong></span>
                        {batch.notes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="italic text-stone-500 max-w-xs truncate">{batch.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stage & Interactive Timers */}
                    <div className="flex items-center gap-3 shrink-0">
                      {isBaking && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                          <Flame className="w-4 h-4 text-amber-700 animate-pulse" />
                          <div className="font-mono text-xs font-bold text-amber-900">
                            {Math.floor(batch.timerMinutesRemaining || 0)}m {Math.round(((batch.timerMinutesRemaining || 0) % 1) * 60)}s
                          </div>
                          <button
                            onClick={() => toggleBatchTimer(batch.id)}
                            className="p-1 text-amber-800 hover:text-amber-950 cursor-pointer"
                            title={batch.timerRunning ? 'Pause timer' : 'Resume timer'}
                          >
                            {batch.timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}

                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-700 block">
                          Stage: {batch.stage}
                        </span>
                        {isReady ? (
                          <button
                            onClick={() => sendBatchToCounter(batch.id)}
                            className="mt-1 text-xs font-semibold px-2.5 py-1 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors cursor-pointer"
                          >
                            Send to Counter Stock
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('production')}
                            className="text-[11px] text-stone-500 hover:text-stone-800 underline mt-0.5 block"
                          >
                            Manage batch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Today's Custom Pre-orders */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Custom Pickups Today</h2>
                <p className="text-xs text-stone-500">Customer cake orders and bulk bread holds</p>
              </div>
              <button
                onClick={onOpenNewOrder}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 cursor-pointer"
              >
                + New Pre-Order
              </button>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
              {todayOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500">
                  No pre-orders scheduled for customer pickup today.
                </div>
              ) : (
                todayOrders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-mono font-semibold text-stone-700">{order.pickupTime}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-stone-900">{order.customerName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.customerPhone}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-800 mt-0.5">{order.itemsDescription}</p>
                      {order.specialInstructions && (
                        <p className="text-xs text-amber-900 italic mt-0.5">Note: {order.specialInstructions}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-stone-900">
                          {settings.currencySymbol}{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500">
                          {order.balanceDue > 0 ? (
                            <span className="text-amber-800">Due: {settings.currencySymbol}{order.balanceDue.toFixed(2)}</span>
                          ) : (
                            <span className="text-emerald-700">Paid in Full</span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-mono font-medium text-stone-700 px-2 py-1 bg-stone-100 rounded-md">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Counter Register Stream & Pantry Alerts */}
        <div className="space-y-6">
          
          {/* Quick POS Access Card */}
          <div className="bg-stone-900 text-stone-100 p-6 rounded-xl flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Counter Register</span>
              <h3 className="font-serif text-xl font-bold mt-1 text-white">Fast Touchscreen POS</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Take walk-in customer orders, auto-calculate change, slice bread options, and generate thermal receipts.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('pos')}
              className="mt-6 w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Launch Counter Terminal</span>
            </button>
          </div>

          {/* Recent Counter Transactions */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Recent Transactions</h3>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold"
              >
                All Receipts
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-1">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-semibold text-stone-900">{tx.receiptNumber}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {tx.items.length} items · {tx.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-stone-900">
                      {settings.currencySymbol}{tx.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      className="text-[11px] text-amber-800 hover:underline cursor-pointer"
                    >
                      View receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockIngredients.length > 0 && (
            <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Pantry Reorder Alerts</span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Ingredients currently below bakery safety buffer:
              </p>
              <div className="mt-3 space-y-2">
                {lowStockIngredients.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-amber-200">
                    <div>
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        Stock: {item.currentStock} {item.unit} (Min: {item.reorderLevel} {item.unit})
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="px-2 py-1 text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                    >
                      Receive
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
