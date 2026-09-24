import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  FileText,
  CreditCard
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    transactions, 
    settings, 
    products, 
    setSelectedReceipt 
  } = useBakery();

  const [dateFilter, setDateFilter] = useState<'all' | 'today'>('today');

  const todayStr = new Date().toISOString().slice(0, 10);
  const filteredTx = dateFilter === 'today'
    ? transactions.filter(t => t.timestamp.startsWith(todayStr))
    : transactions;

  const totalRevenue = filteredTx.reduce((sum, t) => sum + t.total, 0);
  const totalSubtotal = filteredTx.reduce((sum, t) => sum + t.subtotal, 0);
  const totalTax = filteredTx.reduce((sum, t) => sum + t.taxAmount, 0);
  const avgTicket = filteredTx.length > 0 ? totalRevenue / filteredTx.length : 0;

  // Breakdown by payment method
  const cashSales = filteredTx.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.total, 0);
  const cardSales = filteredTx.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.total, 0);
  const contactlessSales = filteredTx.filter(t => t.paymentMethod === 'contactless').reduce((sum, t) => sum + t.total, 0);

  // Top products sold
  const productSalesMap: { [name: string]: { qty: number; revenue: number } } = {};
  filteredTx.forEach(t => {
    t.items.forEach(item => {
      if (!productSalesMap[item.productName]) {
        productSalesMap[item.productName] = { qty: 0, revenue: 0 };
      }
      productSalesMap[item.productName].qty += item.quantity;
      productSalesMap[item.productName].revenue += item.total;
    });
  });

  const topSellingProducts = Object.entries(productSalesMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Estimated Food Cost (COGS) based on standard 22% artisan food cost
  const estimatedCOGS = totalSubtotal * 0.22;
  const grossProfit = totalSubtotal - estimatedCOGS;
  const grossMargin = totalSubtotal > 0 ? (grossProfit / totalSubtotal) * 100 : 0;

  const handleExportCSV = () => {
    const headers = ["Receipt Number", "Timestamp", "Items Count", "Subtotal", "Tax", "Total", "Payment Method", "Cashier"];
    const rows = filteredTx.map(t => [
      t.receiptNumber,
      `"${t.timestamp}"`,
      t.items.reduce((sum, i) => sum + i.quantity, 0),
      t.subtotal.toFixed(2),
      t.taxAmount.toFixed(2),
      t.total.toFixed(2),
      t.paymentMethod,
      `"${t.cashierName}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bakery_sales_report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Financials & Reports</span>
            <span aria-hidden="true">·</span>
            <span>Shift Sales, Taxes & Food Cost Analysis</span>
            <span aria-hidden="true">·</span>
            <span>{filteredTx.length} transactions</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sales Ledger & Daily Shift Close
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          onClick={() => setDateFilter('today')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            dateFilter === 'today'
              ? 'bg-amber-900 text-white border-amber-900 font-semibold'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          Today's Shift ({todayStr})
        </button>
        <button
          onClick={() => setDateFilter('all')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            dateFilter === 'all'
              ? 'bg-amber-900 text-white border-amber-900 font-semibold'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          All-Time Historical ({transactions.length})
        </button>
      </div>

      {/* Key Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Gross Sales Volume</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-stone-400 mt-1 font-mono">
            Net: {settings.currencySymbol}{totalSubtotal.toFixed(2)} + {settings.currencySymbol}{totalTax.toFixed(2)} tax
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Average Basket / Ticket</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{avgTicket.toFixed(2)}
          </div>
          <div className="text-xs text-stone-400 mt-1 font-mono">
            Over {filteredTx.length} completed customer sales
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Estimated Food Cost (COGS)</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{estimatedCOGS.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-700 font-mono mt-1 font-semibold">
            Gross Margin: ~{grossMargin.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Sales Tax Accrued</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums mt-1">
            {settings.currencySymbol}{totalTax.toFixed(2)}
          </div>
          <div className="text-xs text-stone-400 mt-1 font-mono">
            Rate: {(settings.taxRate * 100).toFixed(0)}% local sales tax
          </div>
        </div>

      </div>

      {/* Two Column Section: Payment breakdown & Top sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Tender Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">
            Tender & Payment Methods
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Contactless / Mobile Tap</span>
                <span>{settings.currencySymbol}{contactlessSales.toFixed(2)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-800 h-full rounded-full" 
                  style={{ width: `${totalRevenue > 0 ? (contactlessSales / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Chip Card / Terminal</span>
                <span>{settings.currencySymbol}{cardSales.toFixed(2)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-stone-700 h-full rounded-full" 
                  style={{ width: `${totalRevenue > 0 ? (cardSales / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Physical Cash Drawer</span>
                <span>{settings.currencySymbol}{cashSales.toFixed(2)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-700 h-full rounded-full" 
                  style={{ width: `${totalRevenue > 0 ? (cashSales / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Baked Goods */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">
            Top Performing Counter Bakes
          </h3>

          <div className="divide-y divide-stone-100">
            {topSellingProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400">
                No items recorded in this timeframe.
              </div>
            ) : (
              topSellingProducts.map(([name, data], idx) => (
                <div key={name} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-400 font-bold w-4">
                      {idx + 1}.
                    </span>
                    <span className="font-semibold text-stone-900">{name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-stone-900 font-bold">
                      {settings.currencySymbol}{data.revenue.toFixed(2)}
                    </span>
                    <span className="text-stone-400 ml-2">
                      ({data.qty} sold)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Itemized Transactions Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <h3 className="font-bold text-stone-900 text-sm">
            Transaction Ledger ({filteredTx.length})
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Click any row to inspect & re-print receipt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px] font-sans">
              <tr>
                <th className="py-3 px-4">Receipt</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Tax</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Tender</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400 font-sans">
                    No transactions registered in this period.
                  </td>
                </tr>
              ) : (
                filteredTx.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedReceipt(t)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {t.receiptNumber}
                    </td>

                    <td className="py-3 px-4 text-stone-500">
                      {t.timestamp}
                    </td>

                    <td className="py-3 px-4 font-sans text-stone-800">
                      <span className="line-clamp-1">
                        {t.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-stone-600">
                      {settings.currencySymbol}{t.subtotal.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-stone-500">
                      {settings.currencySymbol}{t.taxAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums font-bold text-stone-900">
                      {settings.currencySymbol}{t.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 capitalize text-stone-700">
                      {t.paymentMethod}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReceipt(t);
                        }}
                        className="text-amber-800 hover:text-amber-950 underline font-sans text-xs"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
