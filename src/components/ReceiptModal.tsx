import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { Printer, X } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, settings } = useBakery();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        
        {/* Controls */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 no-print">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Thermal Receipt Preview
          </span>
          <button
            onClick={() => setSelectedReceipt(null)}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authentic Thermal Receipt Paper Area */}
        <div id="receipt-paper" className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono space-y-3">
          
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-300">
            <h2 className="font-serif text-base font-bold text-stone-900 tracking-tight">
              {settings.bakeryName}
            </h2>
            <p className="text-[11px] text-stone-500 font-sans">{settings.tagline}</p>
            <p className="text-[10px] text-stone-400 font-sans">{settings.address}</p>
            <p className="text-[10px] text-stone-400 font-mono">Tel: {settings.phone}</p>
          </div>

          {/* Metadata */}
          <div className="space-y-0.5 text-[11px] text-stone-600">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold text-stone-900">{selectedReceipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{selectedReceipt.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{selectedReceipt.cashierName}</span>
            </div>
          </div>

          {/* Items */}
          <div className="pt-2 border-t border-dashed border-stone-300 space-y-2">
            {selectedReceipt.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-medium text-stone-900">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-bold tabular-nums">
                    {settings.currencySymbol}{item.total.toFixed(2)}
                  </span>
                </div>
                {item.selectedOption && (
                  <div className="text-[10px] text-stone-400 pl-4">
                    · {item.selectedOption}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-stone-300 space-y-1 text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="tabular-nums">{settings.currencySymbol}{selectedReceipt.subtotal.toFixed(2)}</span>
            </div>
            {selectedReceipt.discountAmount > 0 && (
              <div className="flex justify-between text-amber-900">
                <span>Discount:</span>
                <span className="tabular-nums">-{settings.currencySymbol}{selectedReceipt.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax ({(settings.taxRate * 100).toFixed(0)}%):</span>
              <span className="tabular-nums">{settings.currencySymbol}{selectedReceipt.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-300">
              <span>TOTAL:</span>
              <span className="tabular-nums">{settings.currencySymbol}{selectedReceipt.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Tender */}
          <div className="pt-2 border-t border-dashed border-stone-300 text-[11px] text-stone-600 space-y-0.5">
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span className="uppercase font-bold">{selectedReceipt.paymentMethod}</span>
            </div>
            {selectedReceipt.amountTendered !== undefined && (
              <>
                <div className="flex justify-between">
                  <span>Cash Tendered:</span>
                  <span className="tabular-nums">{settings.currencySymbol}{selectedReceipt.amountTendered.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Change Given:</span>
                  <span className="tabular-nums">{settings.currencySymbol}{(selectedReceipt.changeGiven || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-500 font-sans">
            <p className="leading-snug">{settings.receiptFooterNote}</p>
            <p className="mt-1 font-mono text-[9px] text-stone-400">www.crumbcrustbakehouse.com</p>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 no-print">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
