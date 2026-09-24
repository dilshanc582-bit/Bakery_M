import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { CustomOrder, OrderStatus } from '../types/bakery';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Filter, 
  X,
  CreditCard
} from 'lucide-react';

interface PreOrdersViewProps {
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
}

export const PreOrdersView: React.FC<PreOrdersViewProps> = ({
  isNewOrderModalOpen,
  setIsNewOrderModalOpen
}) => {
  const { 
    customOrders, 
    addCustomOrder, 
    updateOrderStatus, 
    recordOrderPayment, 
    settings 
  } = useBakery();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'ready'>('all');
  
  // Payment modal state
  const [orderForPayment, setOrderForPayment] = useState<CustomOrder | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // New Order Form state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('11:00');
  const [itemsDescription, setItemsDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(45.00);
  const [depositPaid, setDepositPaid] = useState<number>(20.00);

  const filteredOrders = customOrders.filter(o => {
    if (dateFilter === 'today') return o.pickupDate === todayStr;
    if (dateFilter === 'upcoming') return o.pickupDate >= todayStr && o.status !== 'completed';
    if (dateFilter === 'ready') return o.status === 'ready';
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !itemsDescription.trim()) return;

    addCustomOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      pickupDate,
      pickupTime,
      itemsDescription,
      specialInstructions: specialInstructions || undefined,
      totalAmount,
      depositPaid,
      status: depositPaid > 0 ? 'confirmed' : 'inquiry'
    });

    setIsNewOrderModalOpen(false);
    // Reset
    setCustomerName('');
    setCustomerPhone('');
    setItemsDescription('');
    setSpecialInstructions('');
  };

  const handleOpenPayment = (order: CustomOrder) => {
    setOrderForPayment(order);
    setPaymentAmount(order.balanceDue);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderForPayment && paymentAmount > 0) {
      recordOrderPayment(orderForPayment.id, paymentAmount);
      setOrderForPayment(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'inquiry': return 'bg-stone-100 text-stone-700';
      case 'confirmed': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'in_prep': return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'ready': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-stone-100 text-stone-500';
      case 'cancelled': return 'bg-red-50 text-red-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Pre-Orders & Reservations</span>
            <span aria-hidden="true">·</span>
            <span>Custom Celebration Cakes & Catering</span>
            <span aria-hidden="true">·</span>
            <span>{customOrders.length} records</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Custom Orders & Bread Reservations
          </h1>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Pre-Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        {[
          { id: 'all', label: `All Orders (${customOrders.length})` },
          { id: 'today', label: `Today's Pickups (${customOrders.filter(o => o.pickupDate === todayStr).length})` },
          { id: 'upcoming', label: 'Upcoming Active' },
          { id: 'ready', label: `Ready for Pickup (${customOrders.filter(o => o.status === 'ready').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDateFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              dateFilter === tab.id
                ? 'bg-amber-900 text-white border-amber-900 font-semibold'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
            <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">No custom orders found for this view</p>
            <p className="text-xs text-stone-400 mt-1">Book customer requests using the button above.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isToday = order.pickupDate === todayStr;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl border p-5 transition-all space-y-4 ${
                  order.status === 'ready'
                    ? 'border-emerald-300 shadow-xs'
                    : isToday
                    ? 'border-amber-300'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left: Customer & Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono font-medium text-stone-800">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {order.pickupDate} at {order.pickupTime}
                        {isToday && (
                          <span className="text-[10px] text-amber-900 font-sans font-bold bg-amber-100 px-1.5 py-0.2 rounded ml-1">
                            TODAY
                          </span>
                        )}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <span>{order.customerName}</span>
                      <span className="font-sans font-normal text-xs text-stone-500">
                        ({order.customerPhone})
                      </span>
                    </h2>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-800 font-medium">
                      {order.itemsDescription}
                    </div>

                    {order.specialInstructions && (
                      <p className="text-xs text-amber-900 italic bg-amber-50/70 p-2 rounded border border-amber-100">
                        Decoration / Note: "{order.specialInstructions}"
                      </p>
                    )}
                  </div>

                  {/* Right: Payment & Status Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                    
                    {/* Financial balance box */}
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-stone-500">
                        Total: <strong className="font-mono text-stone-900">{settings.currencySymbol}{order.totalAmount.toFixed(2)}</strong>
                      </div>
                      <div className="text-xs font-mono mt-0.5">
                        {order.balanceDue > 0 ? (
                          <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            Due: {settings.currencySymbol}{order.balanceDue.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            Paid in Full
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Dropdown & Payment Button */}
                    <div className="flex items-center gap-2">
                      {order.balanceDue > 0 && (
                        <button
                          onClick={() => handleOpenPayment(order)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                        >
                          Record Pay
                        </button>
                      )}

                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="inquiry">Inquiry</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_prep">In Prep</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="completed">Completed / Picked Up</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Payment Modal */}
      {orderForPayment && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900">
                Record Payment
              </h3>
              <button onClick={() => setOrderForPayment(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Order {orderForPayment.orderNumber} for <strong>{orderForPayment.customerName}</strong>.
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Payment Amount Received ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderForPayment(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Custom Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Custom Booking</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  New Customer Pre-Order
                </h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Ordered Breads, Cakes & Pastries
                </label>
                <textarea
                  required
                  rows={2}
                  value={itemsDescription}
                  onChange={(e) => setItemsDescription(e.target.value)}
                  placeholder="e.g. 1x 8-inch Strawberry Gateau, 4x Sourdough Loaves (unsliced)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Piping / Message / Custom Inscription
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Inscribe 'Happy 30th Birthday Leo' in dark chocolate"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Total Quoted Amount ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Deposit Paid Upfront ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg"
                >
                  Confirm Reservation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
