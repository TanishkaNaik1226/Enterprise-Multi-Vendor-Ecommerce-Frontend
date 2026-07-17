import React from 'react';
import { Download } from 'lucide-react';

export default function InvoiceButton({ order }) {
  const downloadInvoice = () => {
    const orderId = order.orderId || order.id || 'order';
    const content = `ShopStack Invoice\nOrder: ${orderId}\nTotal: ${Number(order.total || 0).toFixed(2)}\nPayment status: ${order.paymentStatus || '—'}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopstack-invoice-${orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button className="btn btn-secondary" onClick={downloadInvoice} style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}><Download size={14} /> Invoice</button>;
}
