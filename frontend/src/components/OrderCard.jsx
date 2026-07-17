import React from 'react';
import { Eye, RotateCcw, XCircle } from 'lucide-react';
import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';
import InvoiceButton from './InvoiceButton';

const vendorStatuses = ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function OrderCard({ order, isVendor, onStatusChange, onOpenDetails, onCancel, onReturn, onReorder }) {
  const orderId = order.orderId || order.id;
  const normalizedStatus = String(order.status || 'PENDING').toUpperCase().replace(/ /g, '_');
  const items = order.items || [];
  const canCancel = ['PENDING', 'CONFIRMED'].includes(normalizedStatus);
  return <article className="order-card glass-card" style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'start' }}><div><strong>Order #{orderId}</strong><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{order.customerName || order.customer?.name || (isVendor ? 'Customer details unavailable' : '')}</div></div><StatusBadge status={normalizedStatus} /></div>
    <div style={{ margin: '12px 0', display: 'grid', gap: '8px' }}>{items.slice(0, 2).map((item, index) => <div key={item.id || item.productId || index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ProductImage src={item.image || item.product?.image} alt={item.productName || item.name || item.product?.name} style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} /><span style={{ flex: 1, fontSize: '0.85rem' }}>{item.productName || item.name || item.product?.name || 'Product'} × {item.quantity || 1}</span><span style={{ fontSize: '0.82rem' }}>${Number(item.price || item.unitPrice || 0).toFixed(2)}</span></div>)}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}><span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Payment: {order.paymentStatus || '—'}</span><strong>${Number(order.total || 0).toFixed(2)}</strong></div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
      <button className="btn btn-secondary" onClick={() => onOpenDetails(order)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}><Eye size={14} /> Details</button>
      {!isVendor && <><InvoiceButton order={order} /><button className="btn btn-secondary" onClick={() => onReorder(order)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}><RotateCcw size={14} /> Reorder</button>{canCancel && <button className="btn btn-secondary" onClick={() => onCancel(order)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', color: '#ef4444' }}><XCircle size={14} /> Cancel</button>}{normalizedStatus === 'DELIVERED' && <button className="btn btn-secondary" onClick={() => onReturn(order)} style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>Return</button>}</>}
      {isVendor && <select value={normalizedStatus} onChange={(event) => onStatusChange(orderId, event.target.value)} style={{ marginLeft: 'auto', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.35rem' }}>{vendorStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}</select>}
    </div>
  </article>;
}
