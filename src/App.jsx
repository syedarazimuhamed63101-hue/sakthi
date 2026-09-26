import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* =========================================================
   ICONS — small inline SVG set, no external icon library
   ========================================================= */
const ICONS = {
  home: <><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10.5V20h12v-9.5" /><path d="M10 20v-5h4v5" /></>,
  building: <><path d="M5 21V5.5L12 3l7 2.5V21" /><path d="M8 8h1M11.5 8h1M15 8h1M8 12h1M11.5 12h1M15 12h1" /><path d="M10 21v-5h4v5" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><circle cx="17.5" cy="9.5" r="2.3" /><path d="M15.5 20c0-2.6 1.8-4.3 4.3-4.6" /></>,
  cash: <><path d="M5 7h14v10H5z" /><path d="M8 10.5h5a1.8 1.8 0 1 1 0 3.6H8" /><path d="M8 10.5V16" /><path d="M8 13h6" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
  wrench: <><path d="M14 6a4 4 0 0 0-4.8 5L4 16.2 7.8 20l5.2-5.2A4 4 0 0 0 18 10l-3 2-3-3z" /><path d="m5.5 17.5 1 1" /></>,
  box: <><path d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5z" /><path d="M5 7.5 12 11l7-3.5" /><path d="M12 11v9" /></>,
  bolt: <><path d="M13.5 2.5 6 12h5l-.8 9.5L18 12h-5z" /></>,
  chart: <><line x1="4" y1="20" x2="4" y2="12" /><line x1="9.3" y1="20" x2="9.3" y2="6" /><line x1="14.6" y1="20" x2="14.6" y2="14" /><line x1="20" y1="20" x2="20" y2="9" /></>,
  bell: <><path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-3 8.5-3 8.5h18s-3-2-3-8.5" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  settings: <><circle cx="12" cy="12" r="3.2" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" /><line x1="4.9" y1="19.1" x2="7" y2="17" /><line x1="17" y1="7" x2="19.1" y2="4.9" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.6" y2="16.6" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4.3 1.3L4 16Z" /></>,
  trash: <><path d="M3.5 6h17" /><path d="M8 6V4h8v2" /><path d="M18.5 6 17.6 20H6.4L5.5 6" /><line x1="10" y1="10" x2="10" y2="16" /><line x1="14" y1="10" x2="14" y2="16" /></>,
  download: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" /><path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a17.6 17.6 0 0 1-3.1 4.1" /><path d="M6.2 6.3C3.7 8 2.5 12 2.5 12S6 19 12 19c1.2 0 2.3-.2 3.3-.5" /></>,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  check: <><path d="M5 12.5 9.5 17 19 7.5" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="7.5" x2="12" y2="13" /><circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" /></>,
  mapPin: <><path d="M12 21s7-6.7 7-12.2A7 7 0 1 0 5 8.8C5 14.3 12 21 12 21Z" /><circle cx="12" cy="8.8" r="2.4" /></>,
  phone: <path d="M21.5 16.7v2.9a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.6 4.6 1.9 1.9 0 0 1 4.5 2.5h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.3 1.7.6 2.5a1.9 1.9 0 0 1-.4 2L7.8 9.9a15.2 15.2 0 0 0 6 6l1.3-1.3a1.9 1.9 0 0 1 2-.4c.8.3 1.6.5 2.5.6a1.9 1.9 0 0 1 1.9 1.9Z" />,
  file: <><path d="M14 3v5h5" /><path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /></>,
  archive: <><rect x="3" y="4" width="18" height="4" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" /><line x1="10" y1="12.5" x2="14" y2="12.5" /></>,
  arrowLeft: <><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></>,
  land: <><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></>,
  send: <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  circle: <circle cx="12" cy="12" r="9" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  user: <><circle cx="12" cy="8" r="3.2" /><path d="M5 21c0-3.7 3-6 7-6s7 2.3 7 6" /></>,
  key: <><circle cx="8" cy="16" r="3" /><path d="m10.5 13.5 7-7m-2 0 2 2m-4-4 2 2" /></>,
  shield: <><path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0 1 5" /><path d="M20 4v7h-7" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  external: <><path d="M14 5h5v5" /><path d="m19 5-8 8" /><path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></>,
  camera: <><path d="M4 7h4l1.5-2h5L16 7h4v12H4z" /><circle cx="12" cy="13" r="3.2" /></>,
  filePlus: <><path d="M14 3v5h5" /><path d="M6 3h8l5 5v13H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M12 12v6M9 15h6" /></>,
};

function Icon({ name, size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`}>
      {ICONS[name] || ICONS.circle}
    </svg>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const formatCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
const formatCompactCurrency = (v) => {
  const n = Number(v || 0);
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 2)}Cr`;
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 2)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return formatCurrency(n);
};
const formatDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
function downloadTextFile(filename, text, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadDocument(doc) {
  if (!doc?.dataUrl) return;
  const a = document.createElement('a');
  a.href = doc.dataUrl;
  a.download = doc.name || 'document';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function viewableDocument(doc) { return !!(doc && doc.dataUrl); }

const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_DOCUMENT_EXTENSIONS = new Set(['jpg','jpeg','png','webp','pdf','doc','docx']);
const IMAGE_EXTENSIONS = new Set(['jpg','jpeg','png','webp']);

function safeFileName(name) {
  return String(name || 'document')
    .replace(/[\\\/\u0000-\u001F<>:"|?*]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'document';
}

function fileExtension(name) {
  const parts = String(name || '').toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function validateUpload(file, { imageOnly = false, maxBytes = DOCUMENT_MAX_BYTES } = {}) {
  if (!file) return 'No file selected.';
  if (file.size <= 0) return 'The selected file is empty.';
  if (file.size > maxBytes) return `File is too large. Maximum allowed size is ${Math.round(maxBytes / (1024 * 1024))} MB.`;
  const ext = fileExtension(file.name);
  if (imageOnly && !IMAGE_EXTENSIONS.has(ext)) return 'Use JPG, JPEG, PNG or WEBP for profile photos.';
  if (!imageOnly && !ALLOWED_DOCUMENT_EXTENSIONS.has(ext)) return 'File type not allowed. Use JPG, JPEG, PNG, WEBP, PDF, DOC or DOCX.';
  if (file.type === 'text/html' || file.type === 'image/svg+xml' || /javascript|html|svg/i.test(file.type || '')) return 'This file type is blocked for security.';
  return '';
}

function makeDocumentRecord(file, options = {}) {
  return new Promise((resolve) => {
    const error = validateUpload(file, options);
    if (error) { resolve(null); return; }
    const reader = new FileReader();
    reader.onload = () => resolve({
      id: uid(),
      name: safeFileName(file.name),
      type: file.type || 'application/octet-stream',
      size: file.size,
      dataUrl: reader.result,
      uploadedAt: new Date().toISOString(),
    });
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function normalizeDocumentValue(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  return value === true ? { legacy: true } : null;
}

function documentStatus(value) {
  const doc = normalizeDocumentValue(value);
  if (!doc) return 'Not attached';
  if (doc.legacy) return 'Recorded';
  return doc.name || 'Uploaded';
}

function recordAsDownloadText(title, record) {
  function printable(value) {
    if (Array.isArray(value)) return value.map(printable);
    if (value && typeof value === 'object') {
      const out = {};
      Object.entries(value).forEach(([key, val]) => {
        out[key] = key === 'dataUrl' ? '[stored file omitted]' : printable(val);
      });
      return out;
    }
    return value ?? '';
  }
  return `${title}\n${'='.repeat(title.length)}\n\n${Object.entries(record).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(printable(value), null, 2) : (value ?? '')}`).join('\n')}`;
}


function openWhatsAppForTenant(tenant, message) {
  if (!tenant?.phone) return false;
  const digits = String(tenant.phone).replace(/\D/g, '');
  const phone = digits.length === 10 ? `91${digits}` : digits;
  if (!phone) return false;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

function downloadRentHistoryPDF(tenant, property) {
  if (!tenant) return;
  const history = Array.isArray(tenant.rentHistory) ? tenant.rentHistory : [];
  const total = history.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const paid = history.filter((r) => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const pending = history.filter((r) => r.status !== 'Paid').reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const rows = history.map((r) => `
    <tr>
      <td>${r.month || ''} ${r.year || ''}</td>
      <td>${formatCurrency(r.amount)}</td>
      <td><span class="status ${String(r.status).toLowerCase()}">${r.status || 'Pending'}</span></td>
      <td>${formatDate(r.paidDate)}</td>
      <td>${formatDate(r.dueDate)}</td>
    </tr>
  `).join('');
  const win = window.open('', '_blank', 'noopener,noreferrer,width=980,height=760');
  if (!win) return;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${tenant.fullName} - Rent History</title>
  <style>
    @page{size:A4;margin:16mm}
    *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#1d2d43;background:#fff;margin:0}
    .header{border-bottom:2px solid #e8d8ad;padding:0 0 14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start}
    .brand{font-size:22px;font-weight:800;color:#123f78;letter-spacing:.02em}.sub{font-size:11px;color:#708096;margin-top:3px}
    h1{font-size:21px;margin:0 0 4px;color:#143c70}.muted{color:#748298;font-size:12px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
    .box{border:1px solid #e1e8ef;border-radius:10px;padding:10px 12px;background:#fbfcfe}.box b{color:#183d6e}.box span{display:block;font-size:11px;color:#7b8798;margin-bottom:3px}.box strong{font-size:13px;color:#1d2d43}
    .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.summary .box{text-align:left}.summary .value{font-size:18px;font-weight:800;color:#123f78}
    table{width:100%;border-collapse:collapse;font-size:11px}th{background:#f4f7fb;color:#5d6d82;text-align:left;padding:8px;border-bottom:1px solid #dfe7ef}td{padding:8px;border-bottom:1px solid #e8edf3;color:#2b3a4d}
    .status{font-weight:700}.status.paid{color:#4f8b68}.status.pending{color:#ad7a25}.status.overdue{color:#b76060}
    .footer{margin-top:22px;padding-top:10px;border-top:1px solid #e4e9ef;font-size:10px;color:#8591a1}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  </style></head><body>
  <div class="header"><div><div class="brand">SAKTHI CONSTRUCTION</div><div class="sub">Property &amp; Facility Management</div></div><div class="muted">Rent History Report</div></div>
  <h1>${tenant.fullName}</h1><div class="muted">Generated on ${formatDate(new Date())}</div>
  <div class="meta" style="margin-top:14px">
    <div class="box"><span>Property</span><strong>${property?.name || '—'}</strong></div>
    <div class="box"><span>Property type</span><strong>${property?.type || '—'}</strong></div>
    <div class="box"><span>Tenant phone</span><strong>${tenant.phone || '—'}</strong></div>
    <div class="box"><span>Tenancy period</span><strong>${formatDate(tenant.dateOfComing)} - ${formatDate(tenant.dateOfLeaving)}</strong></div>
    <div class="box"><span>Tenant status</span><strong>${tenant.status || 'Active'}</strong></div>
    <div class="box"><span>Owner</span><strong>${property?.ownerName || '—'}</strong></div>
  </div>
  <div class="summary">
    <div class="box"><span>Total recorded rent</span><div class="value">${formatCurrency(total)}</div></div>
    <div class="box"><span>Rent paid</span><div class="value">${formatCurrency(paid)}</div></div>
    <div class="box"><span>Outstanding</span><div class="value">${formatCurrency(pending)}</div></div>
  </div>
  <table><thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid on</th><th>Due date</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No rent history recorded.</td></tr>'}</tbody></table>
  <div class="footer">Sakthi Construction - Tenant rent history. This report contains the rent records currently stored in the application.</div>
  <script>window.onload=function(){setTimeout(function(){window.print()},250)};<\/script>
  </body></html>`);
  win.document.close();
}

function DocumentViewer({ documentRecord, title, onClose }) {
  const doc = normalizeDocumentValue(documentRecord);
  return (
    <Modal title={title} onClose={onClose} wide>
      {!doc || !doc.dataUrl ? (
        <EmptyState text={doc?.legacy ? 'This document is recorded, but the original file is not stored.' : 'No document file attached.'} />
      ) : (
        <div className="document-preview">
          {doc.type?.startsWith('image/') ? <img src={doc.dataUrl} alt={doc.name} />
            : doc.type === 'application/pdf' ? <iframe title={doc.name} src={doc.dataUrl} />
            : <div className="document-file-fallback"><Icon name="file" size={30} /><p>{doc.name}</p><p className="muted small">Preview is unavailable for this file type.</p></div>}
          <div className="document-preview-actions">
            <button className="btn btn-primary" onClick={() => downloadDocument(doc)}><Icon name="download" size={15} /> Download document</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function getPropertyName(properties, id) {
  const p = properties.find((x) => x.id === id);
  return p ? p.name : '—';
}

/* =========================================================
   CONSTANTS
   ========================================================= */
const PROPERTY_TYPES = ['House', 'Office', 'Godown', 'Complex', 'Land'];
const AMENITIES_LIST = ['Gated Security', 'Lift', 'Power Backup', 'Parking', 'Garden', 'Play Area', 'Gym', 'Swimming Pool', 'Club House', 'Sports Facility'];
const FURNISHED_TYPES = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'];
const DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const RELATIONS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Other'];
const DOCUMENT_TYPES = ['Aadhar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* =========================================================
   DATA CONFIGURATION

   The application starts empty by design. Records are created by the
   existing CRUD flows and are never populated with demo/seed content.
   ========================================================= */
const CHART_COLORS = ['#214A91', '#6E88B6', '#E3AD42', '#C96B61', '#C7D1DE'];


/* =========================================================
   SMALL UI ATOMS
   ========================================================= */
function EmptyState({ text, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <Icon name="archive" size={30} />
      <p>{text}</p>
      {actionLabel && <button className="btn btn-primary btn-sm" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function Badge({ text, tone = 'default' }) {
  return <span className={`badge badge-${tone}`}>{text}</span>;
}

function StatCard({ icon, label, value, sub, tone = 'default' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon"><Icon name={icon} size={22} /></div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, footer, wide, small }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-panel ${wide ? 'modal-wide' : ''} ${small ? 'modal-sm' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, onCancel, onConfirm, danger = true }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>{title}</h3></div>
        <div className="modal-body"><p>{message}</p></div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
    </div>
  );
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) handler(); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [ref, handler]);
}

/* =========================================================
   CHARTS — lightweight SVG, no dependency
   ========================================================= */
function DonutChart({ segments, size = 170, thickness = 24, centerText }) {
  const total = segments.reduce((s, x) => s + (Number(x.value) || 0), 0);
  const center = centerText ?? total;
  const centerFontSize = String(center).length >= 8 ? Math.max(11, Math.round(size * 0.105)) : Math.max(14, Math.round(size * 0.145));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dfe5ef" strokeWidth={thickness} />
      {total > 0 && (
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.filter((seg) => Number(seg.value) > 0).map((seg) => {
            const dash = (Number(seg.value) / total) * c;
            const el = (
              <circle key={seg.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color}
                strokeWidth={thickness} strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} />
            );
            offset += dash;
            return el;
          })}
        </g>
      )}
      <text x="50%" y="47%" textAnchor="middle" className="donut-total" style={{ fontSize: centerFontSize }}>{center}</text>
      <text x="50%" y="63%" textAnchor="middle" className="donut-label">Total</text>
    </svg>
  );
}

function BarChart({ data, keys, colors, height = 220 }) {
  const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => d[k] || 0)));
  return (
    <div className="barchart" style={{ height }}>
      {data.map((d) => (
        <div className="barchart-group" key={d.label}>
          <div className="barchart-bars">
            {keys.map((k, i) => (
              <div key={k} className="barchart-bar" style={{ height: `${((d[k] || 0) / max) * 100}%`, background: colors[i] }}
                title={`${k}: ${formatCurrency(d[k])}`} />
            ))}
          </div>
          <span className="barchart-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   SIDEBAR + TOPBAR
   ========================================================= */
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'properties', label: 'Properties', icon: 'building' },
  { key: 'tenants', label: 'Tenants', icon: 'users' },
  { key: 'rent', label: 'Rent', icon: 'cash' },
  { key: 'bills', label: 'Bills', icon: 'bolt' },
  { key: 'maintenance', label: 'Maintenance', icon: 'wrench' },
  { key: 'storage', label: 'Storage', icon: 'box' },
  { key: 'reports', label: 'Reports', icon: 'chart' },
  { key: 'notifications', label: 'Notifications', icon: 'bell' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

function Sidebar({ page, setPage, unreadCount, onLogout }) {
  const labels = {
    dashboard: 'Dashboard', properties: 'Properties', tenants: 'Tenants', rent: 'Rent Management',
    bills: 'Bills', maintenance: 'Maintenance', storage: 'Storage', reports: 'Reports',
    notifications: 'Notifications', settings: 'Settings'
  };
  const icons = { ...Object.fromEntries(NAV_ITEMS.map((it) => [it.key, it.icon])) };
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Icon name="home" size={24} /></div>
        <div className="brand-copy"><strong>SAKTHI</strong><span>CONSTRUCTION</span><small>Property &amp; Facility Management</small></div>
      </div>
      <nav className="nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((it) => (
          <button key={it.key} className={`nav-item ${page === it.key ? 'active' : ''}`} onClick={() => setPage(it.key)}>
            <Icon name={icons[it.key]} size={16} />
            <span>{labels[it.key] || it.label}</span>
            {it.key === 'notifications' && unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-illustration"><div className="cityline" /></div>
      <div className="sidebar-bottom">
        <button className="logout-link" onClick={onLogout}><Icon name="logout" size={15} /> Logout</button>
        <p>Better Properties<br/>Brighter Future</p>
      </div>
    </aside>
  );
}

function Topbar({ query, setQuery, searchResults, onNavigate, notifications, unreadCount, notifOpen, setNotifOpen, onMarkRead, onMarkAllRead, profileOpen, setProfileOpen, user, onLogout }) {
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  useOutsideClick(notifRef, () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));
  useOutsideClick(searchRef, () => setSearchOpen(false));

  return (
    <header className="topbar">
      <div className="search-box wide" ref={searchRef}>
        <input placeholder="Search properties or tenants..." value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} />
        {searchOpen && query && (
          <div className="search-dropdown">
            {searchResults.length === 0 && <div className="search-empty">No matches</div>}
            {searchResults.map((r) => (
              <div key={r.key} className="search-result" onClick={() => { onNavigate(r.page); setSearchOpen(false); }}>
                <Icon name={r.icon} size={14} /> <span>{r.label}</span><Badge text={r.tag} tone="info" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="topbar-right">
        <div className="notif-wrap" ref={notifRef}>
          <button className="icon-btn" onClick={() => setNotifOpen((o) => !o)}>
            <Icon name="bell" />
            {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="dropdown-panel">
              <div className="dropdown-head"><span>Notifications</span><button className="link-btn" onClick={onMarkAllRead}>Mark all read</button></div>
              <div className="dropdown-list">
                {notifications.length === 0 && <p className="muted small" style={{ padding: '14px' }}>No notifications</p>}
                {notifications.slice(0, 6).map((n) => (
                  <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => onMarkRead(n.id)}>
                    <Icon name={n.type === 'send' ? 'send' : 'alert'} size={15} />
                    <div><p>{n.message}</p><span className="muted small">{formatDate(n.date)}</span></div>
                  </div>
                ))}
              </div>
              <button className="dropdown-footer" onClick={() => { onNavigate('notifications'); setNotifOpen(false); }}>View all</button>
            </div>
          )}
        </div>
        <div className="profile-wrap" ref={profileRef}>
          <div className="profile-trigger" onClick={() => setProfileOpen((o) => !o)}>
            <div className="avatar" aria-hidden="true">{user?.profilePhoto ? <img src={user.profilePhoto} alt="Admin profile" /> : <Icon name="users" size={15} />}</div>
            <div className="profile-text"><strong>{user?.name || user?.username || 'Account'}</strong><span>{user?.role || 'Administrator'}</span></div>
            <Icon name="chevronDown" size={14} />
          </div>
          {profileOpen && (
            <div className="dropdown-panel profile-dropdown">
              <button onClick={() => { onNavigate('settings'); setProfileOpen(false); }}><Icon name="settings" size={14} /> Settings</button>
              <button onClick={() => { setProfileOpen(false); onLogout(); }}><Icon name="logout" size={14} /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   DOCUMENT MANAGER
   Unlimited document entries with secure client-side checks.
   ========================================================= */
function normalizeDocumentList(list) {
  return Array.isArray(list) ? list.map((d) => normalizeDocumentValue(d)).filter(Boolean) : [];
}

function legacyDocumentsToList(value, labels) {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, val]) => {
    const doc = normalizeDocumentValue(val);
    if (!doc) return [];
    if (doc.legacy) return [{ id: uid(), name: labels[key] || key, legacy: true }];
    return [{ ...doc, id: doc.id || uid(), name: doc.name || labels[key] || key }];
  });
}

function DocumentManager({ title, documents, onChange, pushToast, imageOnly = false }) {
  const [draftName, setDraftName] = useState('');
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const docs = normalizeDocumentList(documents);

  async function addFile(file) {
    if (!file) return;
    setStatus('');
    const error = validateUpload(file, { imageOnly, maxBytes: imageOnly ? PROFILE_PHOTO_MAX_BYTES : DOCUMENT_MAX_BYTES });
    if (error) {
      setStatus(error);
      return;
    }
    const record = await makeDocumentRecord(file, { imageOnly, maxBytes: imageOnly ? PROFILE_PHOTO_MAX_BYTES : DOCUMENT_MAX_BYTES });
    if (!record) {
      setStatus('Could not read the selected file.');
      return;
    }
    const named = { ...record, name: safeFileName(draftName || record.name) };
    onChange([...docs, named]);
    setDraftName('');
  }

  function remove(id) {
    onChange(docs.filter((doc) => doc.id !== id));
  }

  return (
    <div className="document-manager">
      <div className="document-manager-head">
        <div>
          <h4>{title}</h4>
          <p className="muted small">Add as many documents as needed. Max {imageOnly ? '5' : '10'} MB per file.</p>
        </div>
        <span className="document-security-note"><Icon name="shield" size={14}/> Secure file checks</span>
      </div>

      <div className="document-add-bar">
        <input className="document-name-input" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Document name (optional)" maxLength={80} />
        <label className="btn btn-outline btn-sm document-add-btn">
          <input ref={fileInputRef} type="file" accept={imageOnly ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx'} onChange={(e) => { const file = e.target.files?.[0]; addFile(file); e.target.value = ''; }} />
          <Icon name="filePlus" size={14}/> Upload file
        </label>
        {!imageOnly && (
          <label className="btn btn-outline btn-sm document-add-btn camera-btn">
            <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; addFile(file); e.target.value = ''; }} />
            <Icon name="camera" size={14}/> Camera
          </label>
        )}
      </div>

      <div className="document-security-help">Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX. Executable, HTML and SVG files are blocked.</div>
      {status && <div className="document-upload-error" role="alert">{status}</div>}

      {docs.length === 0 ? (
        <div className="document-empty"><Icon name="file" size={20}/><span>No documents added yet.</span></div>
      ) : (
        <div className="document-manager-list">
          {docs.map((doc, index) => (
            <div className="document-manager-row" key={doc.id || `${doc.name}-${index}`}>
              <div className="document-manager-info"><span className="document-manager-index">{index + 1}</span><Icon name="file" size={18}/><div><strong>{doc.name}</strong><small>{doc.legacy ? 'Legacy record' : `${documentStatus(doc)}${doc.size ? ` · ${(doc.size / 1024 / 1024).toFixed(1)} MB` : ''}`}</small></div></div>
              <div className="document-manager-actions">
                {viewableDocument(doc) && <button type="button" className="btn btn-xs btn-outline" onClick={() => setPreview({ doc, title: doc.name })}>View</button>}
                {doc?.dataUrl && <button type="button" className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}><Icon name="download" size={12}/> Download</button>}
                <button type="button" className="btn btn-xs btn-outline" onClick={() => remove(doc.id)} aria-label={`Remove ${doc.name}`}><Icon name="trash" size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {preview && <DocumentViewer documentRecord={preview.doc} title={preview.title} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* =========================================================
   PROPERTY FORM
   ========================================================= */
function emptyProperty() {
  return { id: null, mode: 'building', type: 'House', name: '', address: '', state: '', city: '', pincode: '', lat: '', lng: '', totalFloors: '', floorNumber: '', flatType: '', flatsCount: 1, length: '', width: '', carpetArea: '', builtupArea: '', plotArea: '', facingRoad: '', landUse: 'Residential', expectedPrice: '', pricePerSqft: '', monthlyMaintenance: '', direction: '', furnished: 'Unfurnished', amenities: [], landmarks: [], additionalDetails: '', ownerName: '', ownerPhone: '', ownerDocuments: { identity: null, ownership: null, addressProof: null }, ownerDocumentsList: [], propertyDocumentsList: [], status: 'Available', rentAmount: '', forSale: false, listed: false };
}

function PropertyForm({ initial, onSave, onCancel, pushToast }) {
  const [form, setForm] = useState(() => {
    const base = initial ? { ...emptyProperty(), ...initial, mode: initial.type === 'Land' ? 'land' : 'building' } : emptyProperty();
    if ((!base.ownerDocumentsList || base.ownerDocumentsList.length === 0) && base.ownerDocuments) base.ownerDocumentsList = legacyDocumentsToList(base.ownerDocuments, { identity: 'Owner ID proof', ownership: 'Ownership / title document', addressProof: 'Owner address proof' });
    return base;
  });
  const [landmarkDraft, setLandmarkDraft] = useState({ name: '', distance: '', type: '' });

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }
  function toggleAmenity(a) { setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] })); }
  function addLandmark() { if (!landmarkDraft.name) return; setForm((f) => ({ ...f, landmarks: [...f.landmarks, landmarkDraft] })); setLandmarkDraft({ name: '', distance: '', type: '' }); }
  function removeLandmark(i) { setForm((f) => ({ ...f, landmarks: f.landmarks.filter((_, idx) => idx !== i) })); }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.address || !form.ownerName || !form.ownerPhone) return;
    onSave({ ...form, id: form.id || uid(), type: form.mode === 'land' ? 'Land' : form.type });
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="segmented">
        <button type="button" className={form.mode === 'building' ? 'active' : ''} onClick={() => set('mode', 'building')}>Building / Flat</button>
        <button type="button" className={form.mode === 'land' ? 'active' : ''} onClick={() => set('mode', 'land')}>Land / Site</button>
      </div>

      <div className="form-section">
        <h4>{form.mode === 'land' ? 'Land details' : 'Building details'}</h4>
        <div className="form-grid">
          <label>{form.mode === 'land' ? 'Site name *' : 'Building name *'}<input required value={form.name} onChange={(e) => set('name', e.target.value)} /></label>
          {form.mode === 'building' && (
            <label>Property type<select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {PROPERTY_TYPES.filter((t) => t !== 'Land').map((t) => <option key={t}>{t}</option>)}
            </select></label>
          )}
          {form.mode === 'land' && (
            <label>Land use<select value={form.landUse} onChange={(e) => set('landUse', e.target.value)}>
              <option>Residential</option><option>Commercial</option><option>Agricultural</option><option>Industrial</option>
            </select></label>
          )}
        </div>
      </div>

      <div className="form-section">
        <h4>Property address</h4>
        <div className="form-grid">
          <label className="span-2">Address *<input required value={form.address} onChange={(e) => set('address', e.target.value)} /></label>
          <label>State<input value={form.state} onChange={(e) => set('state', e.target.value)} /></label>
          <label>City<input value={form.city} onChange={(e) => set('city', e.target.value)} /></label>
          <label>Pin code<input value={form.pincode} onChange={(e) => set('pincode', e.target.value)} /></label>
          <label>Latitude<input value={form.lat} onChange={(e) => set('lat', e.target.value)} /></label>
          <label>Longitude<input value={form.lng} onChange={(e) => set('lng', e.target.value)} /></label>
        </div>
      </div>

      {form.mode === 'building' && (
        <div className="form-section">
          <h4>Floor-wise details</h4>
          <div className="form-grid">
            <label>Total floors<input type="number" value={form.totalFloors} onChange={(e) => set('totalFloors', e.target.value)} /></label>
            <label>Floor number<input value={form.floorNumber} onChange={(e) => set('floorNumber', e.target.value)} /></label>
            <label>Flat / unit type<input placeholder="e.g. 2BHK, Shop, Unit A" value={form.flatType} onChange={(e) => set('flatType', e.target.value)} /></label>
            <label>No. of units<input type="number" value={form.flatsCount} onChange={(e) => set('flatsCount', e.target.value)} /></label>
          </div>
        </div>
      )}

      <div className="form-section">
        <h4>Measurements &amp; pricing</h4>
        <div className="form-grid">
          {form.mode === 'land' ? (
            <>
              <label>Plot area (sqft) *<input required type="number" value={form.plotArea} onChange={(e) => set('plotArea', e.target.value)} /></label>
              <label>Facing road (ft)<input value={form.facingRoad} onChange={(e) => set('facingRoad', e.target.value)} /></label>
            </>
          ) : (
            <>
              <label>Length (sqft)<input type="number" value={form.length} onChange={(e) => set('length', e.target.value)} /></label>
              <label>Width (sqft)<input type="number" value={form.width} onChange={(e) => set('width', e.target.value)} /></label>
              <label>Carpet area (sqft)<input type="number" value={form.carpetArea} onChange={(e) => set('carpetArea', e.target.value)} /></label>
              <label>Built-up area (sqft)<input type="number" value={form.builtupArea} onChange={(e) => set('builtupArea', e.target.value)} /></label>
            </>
          )}
          <label>Expected price (₹)<input type="number" value={form.expectedPrice} onChange={(e) => set('expectedPrice', e.target.value)} /></label>
          <label>Price / sqft (₹)<input type="number" value={form.pricePerSqft} onChange={(e) => set('pricePerSqft', e.target.value)} /></label>
          {form.mode === 'building' && (
            <>
              <label>Monthly maintenance (₹)<input type="number" value={form.monthlyMaintenance} onChange={(e) => set('monthlyMaintenance', e.target.value)} /></label>
              <label>Monthly rent (₹)<input type="number" value={form.rentAmount} onChange={(e) => set('rentAmount', e.target.value)} /></label>
              <label>Direction<select value={form.direction} onChange={(e) => set('direction', e.target.value)}><option value="">Select</option>{DIRECTIONS.map((d) => <option key={d}>{d}</option>)}</select></label>
              <label>Furnished type<select value={form.furnished} onChange={(e) => set('furnished', e.target.value)}>{FURNISHED_TYPES.map((f) => <option key={f}>{f}</option>)}</select></label>
            </>
          )}
        </div>
      </div>

      {form.mode === 'building' && (
        <div className="form-section">
          <h4>Amenities</h4>
          <div className="checkbox-grid">
            {AMENITIES_LIST.map((a) => (
              <label key={a} className="checkbox"><input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}</label>
            ))}
          </div>
        </div>
      )}

      <div className="form-section">
        <h4>Nearby landmarks</h4>
        <div className="form-grid">
          <label>Landmark<input value={landmarkDraft.name} onChange={(e) => setLandmarkDraft((d) => ({ ...d, name: e.target.value }))} /></label>
          <label>Distance (km)<input type="number" value={landmarkDraft.distance} onChange={(e) => setLandmarkDraft((d) => ({ ...d, distance: e.target.value }))} /></label>
          <label>Type<input placeholder="Hospital, School..." value={landmarkDraft.type} onChange={(e) => setLandmarkDraft((d) => ({ ...d, type: e.target.value }))} /></label>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={addLandmark}><Icon name="plus" size={14} /> Add landmark</button>
        {form.landmarks.length > 0 && (
          <ul className="chip-list">
            {form.landmarks.map((l, i) => (
              <li key={i} className="chip">{l.name} · {l.distance}km · {l.type}<button type="button" onClick={() => removeLandmark(i)}><Icon name="x" size={11} /></button></li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-section">
        <h4>Owner &amp; additional details</h4>
        <div className="form-grid">
          <label className="span-2">Additional details<textarea rows="2" value={form.additionalDetails} onChange={(e) => set('additionalDetails', e.target.value)} /></label>
          <label>Owner name *<input required value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} /></label>
          <label>Phone number *<input required value={form.ownerPhone} onChange={(e) => set('ownerPhone', e.target.value)} /></label>
          <label>Status<select value={form.status} onChange={(e) => set('status', e.target.value)}><option>Available</option><option>Occupied</option></select></label>
        </div>
        <div className="form-section documents-subsection">
          <DocumentManager title="Owner documents" documents={form.ownerDocumentsList || []} onChange={(list) => set('ownerDocumentsList', list)} pushToast={pushToast} />
          <DocumentManager title="Property documents" documents={form.propertyDocumentsList || []} onChange={(list) => set('propertyDocumentsList', list)} pushToast={pushToast} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? 'Save changes' : 'Add property'}</button>
      </div>
    </form>
  );
}

/* =========================================================
   TENANT FORM
   ========================================================= */
function emptyTenant() {
  return { id: null, propertyId: '', fullName: '', dob: '', gender: '', maritalStatus: '', livingInHouse: 'Yes', education: '', occupation: '', religion: '', phone: '', email: '', nativeAddress: '', workAddress: '', familyCount: 0, familyMembers: [], documents: { idProof: null, addressProof: null, panProof: null }, documentsList: [], rehotraType: '', rehotraNumber: '', rentAmount: '', advanceAmount: '', maintenanceFee: '', brokerageFee: '', dateOfComing: '', dateOfLeaving: '', status: 'Active', rentHistory: [] };
}

function TenantForm({ initial, properties, onSave, onCancel, pushToast }) {
  const [form, setForm] = useState(() => {
    const base = initial ? { ...emptyTenant(), ...initial } : emptyTenant();
    if ((!base.documentsList || base.documentsList.length === 0) && base.documents) base.documentsList = legacyDocumentsToList(base.documents, { idProof: 'ID proof', addressProof: 'Address proof', panProof: 'PAN proof' });
    return base;
  });
  const [memberDraft, setMemberDraft] = useState({ relation: '', name: '', phone: '' });
  const [tenantPhoto, setTenantPhoto] = useState(initial?.profilePhoto || null);
  const [propertySearch, setPropertySearch] = useState('');

  function set(f, v) { setForm((s) => ({ ...s, [f]: v })); }
  async function setDoc(k, event) { const rec = await makeDocumentRecord(event.target.files?.[0]); if (rec) setForm((s) => ({ ...s, documents: { ...s.documents, [k]: rec } })); }
  async function setProfilePhoto(event) { const rec = await makeDocumentRecord(event.target.files?.[0], { imageOnly: true, maxBytes: PROFILE_PHOTO_MAX_BYTES }); if (rec?.dataUrl) setTenantPhoto(rec.dataUrl); }
  function addMember() { if (!memberDraft.name) return; setForm((s) => ({ ...s, familyMembers: [...s.familyMembers, memberDraft], familyCount: s.familyMembers.length + 1 })); setMemberDraft({ relation: '', name: '', phone: '' }); }
  function removeMember(i) { setForm((s) => ({ ...s, familyMembers: s.familyMembers.filter((_, idx) => idx !== i), familyCount: Math.max(0, s.familyMembers.length - 1) })); }

  function submit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.propertyId) return;
    onSave({ ...form, id: form.id || uid(), documents: { ...(form.documents || {}) }, profilePhoto: tenantPhoto || form.profilePhoto || null, rentHistory: form.rentHistory || [] });
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-section">
        <h4>Personal details</h4>
        <div className="tenant-photo-row"><div className="tenant-photo-preview">{tenantPhoto ? <img src={tenantPhoto} alt="Tenant profile" /> : <Icon name="user" size={24} />}</div><label className="file-upload-btn btn btn-outline btn-sm"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={setProfilePhoto} />{tenantPhoto ? 'Change photo' : 'Add profile photo'}</label></div>
        <div className="photo-upload"><div className="photo-circle"><Icon name="users" size={22} /></div><span className="muted small">Tenant profile photo</span></div>
        <div className="form-grid">
          <label>Full name *<input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></label>
          <label>Date of birth<input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} /></label>
          <label>Gender<select value={form.gender} onChange={(e) => set('gender', e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>Marital status<select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)}><option value="">Select</option><option>Single</option><option>Married</option></select></label>
          <label>Living in house<select value={form.livingInHouse} onChange={(e) => set('livingInHouse', e.target.value)}><option>Yes</option><option>No</option><option>Partially</option></select></label>
          <label>Education<input value={form.education} onChange={(e) => set('education', e.target.value)} /></label>
          <label>Occupation<input value={form.occupation} onChange={(e) => set('occupation', e.target.value)} /></label>
          <label>Religion<input value={form.religion} onChange={(e) => set('religion', e.target.value)} /></label>
          <label>Phone number *<input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>Email address<input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label className="span-2">Native address<textarea rows="2" value={form.nativeAddress} onChange={(e) => set('nativeAddress', e.target.value)} /></label>
          <label className="span-2">Work address<textarea rows="2" value={form.workAddress} onChange={(e) => set('workAddress', e.target.value)} /></label>
        </div>
      </div>

      <div className="form-section">
        <h4>Assign property</h4>
        <div className="property-search-row"><div className="search-box property-picker-search"><Icon name="search" size={15}/><input placeholder="Search flat, house, complex..." value={propertySearch} onChange={(e)=>setPropertySearch(e.target.value)} /></div><button type="button" className="btn btn-outline btn-sm" onClick={()=>setPropertySearch(propertySearch.trim())}><Icon name="search" size={14}/> Search</button></div>
        <div className="property-picker-list">
          {properties.filter((p)=>{ const q=propertySearch.trim().toLowerCase(); return !q || `${p.name} ${p.type} ${p.address} ${p.city} ${p.flatType||''}`.toLowerCase().includes(q); }).map((p)=><button type="button" key={p.id} className={`property-picker-option ${form.propertyId===p.id?'selected':''}`} onClick={()=>set('propertyId',p.id)}><span><strong>{p.name}</strong><small>{p.type} · {p.flatType || 'Property'} · {p.address}</small></span>{form.propertyId===p.id && <Icon name="check" size={15}/>}</button>)}
          {properties.length>0 && properties.filter((p)=>{ const q=propertySearch.trim().toLowerCase(); return !q || `${p.name} ${p.type} ${p.address} ${p.city} ${p.flatType||''}`.toLowerCase().includes(q); }).length===0 && <p className="muted small">No matching property found.</p>}
        </div>
        <input type="hidden" required value={form.propertyId} onChange={()=>{}} />
      </div>

      <div className="form-section">
        <h4>Family details</h4>
        <div className="counter-row">
          <span>Total no. of people</span>
          <div className="counter">
            <button type="button" onClick={() => set('familyCount', Math.max(0, (form.familyCount || 0) - 1))}>−</button>
            <span>{form.familyCount || 0}</span>
            <button type="button" onClick={() => set('familyCount', (form.familyCount || 0) + 1)}>+</button>
          </div>
        </div>
        <div className="form-grid">
          <label>Relation<select value={memberDraft.relation} onChange={(e) => setMemberDraft((d) => ({ ...d, relation: e.target.value }))}><option value="">Select</option>{RELATIONS.map((r) => <option key={r}>{r}</option>)}</select></label>
          <label>Family member name<input value={memberDraft.name} onChange={(e) => setMemberDraft((d) => ({ ...d, name: e.target.value }))} /></label>
          <label>Phone number<input value={memberDraft.phone} onChange={(e) => setMemberDraft((d) => ({ ...d, phone: e.target.value }))} /></label>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={addMember}><Icon name="plus" size={14} /> Add member</button>
        {form.familyMembers.length > 0 && (
          <ul className="chip-list">
            {form.familyMembers.map((m, i) => (
              <li key={i} className="chip">{m.name} ({m.relation}) — {m.phone}<button type="button" onClick={() => removeMember(i)}><Icon name="x" size={11} /></button></li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-section">
        <DocumentManager title="Tenant documents" documents={form.documentsList || []} onChange={(list) => set('documentsList', list)} pushToast={pushToast} />
        <div className="form-grid">
          <label>Rehotra ID type<select value={form.rehotraType} onChange={(e) => set('rehotraType', e.target.value)}><option value="">Select document</option>{DOCUMENT_TYPES.map((d) => <option key={d}>{d}</option>)}</select></label>
          <label>Document number<input value={form.rehotraNumber} onChange={(e) => set('rehotraNumber', e.target.value)} /></label>
        </div>
      </div>

      <div className="form-section">
        <h4>Rent, advance &amp; brokerage</h4>
        <div className="form-grid">
          <label>Rent amount (₹)<input type="number" value={form.rentAmount} onChange={(e) => set('rentAmount', e.target.value)} /></label>
          <label>Advance paid (₹)<input type="number" value={form.advanceAmount} onChange={(e) => set('advanceAmount', e.target.value)} /></label>
          <label>Maintenance fee (₹)<input type="number" value={form.maintenanceFee} onChange={(e) => set('maintenanceFee', e.target.value)} /></label>
          <label>Brokerage fee (₹)<input type="number" value={form.brokerageFee} onChange={(e) => set('brokerageFee', e.target.value)} /></label>
          <label>Date of coming<input type="date" value={form.dateOfComing} onChange={(e) => set('dateOfComing', e.target.value)} /></label>
          <label>Date of leaving<input type="date" value={form.dateOfLeaving} onChange={(e) => set('dateOfLeaving', e.target.value)} /></label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? 'Save changes' : 'Save tenant'}</button>
      </div>
    </form>
  );
}

/* =========================================================
   DASHBOARD PAGE
   ========================================================= */
function DashboardPage({ properties, tenants, bills, storageFees, notifications, setPage }) {
  const stats = useMemo(() => {
    const total = properties.length;
    const occupied = properties.filter((p) => p.status === 'Occupied').length;
    const available = properties.filter((p) => p.status === 'Available').length;
    const totalUnits = properties.reduce((s, p) => s + (Number(p.flatsCount) || 1), 0);
    const totalTenants = tenants.filter((t) => t.status !== 'Archived').length;
    const rentCollected = tenants.reduce((s, t) => s + (t.rentHistory || []).filter((r) => r.status === 'Paid').reduce((a, r) => a + Number(r.amount || 0), 0), 0);
    const rentOverdue = tenants.reduce((s, t) => s + (t.rentHistory || []).filter((r) => r.status === 'Overdue').reduce((a, r) => a + Number(r.amount || 0), 0), 0);
    const rentPending = tenants.reduce((s, t) => s + (t.rentHistory || []).filter((r) => r.status !== 'Paid' && r.status !== 'Overdue').reduce((a, r) => a + Number(r.amount || 0), 0), 0);
    const electricity = bills.reduce((s, b) => s + Number(b.amount || 0), 0);
    return { total, occupied, available, totalUnits, totalTenants, rentCollected, rentPending, rentOverdue, electricity };
  }, [properties, tenants, bills]);

  const now = new Date();
  const barData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const name = MONTHS[d.getMonth()];
      let expected = 0, collected = 0;
      tenants.forEach((t) => (t.rentHistory || []).forEach((r) => {
        if (r.month === name) {
          const amount = Number(r.amount || 0);
          if (r.status === 'Paid') collected += amount; else expected += amount;
        }
      }));
      months.push({ label: name.slice(0, 3), expected, collected });
    }
    return months;
  }, [tenants]);

  const propertyTypes = [
    { label: 'Houses', value: properties.filter(p => p.type === 'House').length, color: '#214a91' },
    { label: 'Offices', value: properties.filter(p => p.type === 'Office').length, color: '#e0a83b' },
    { label: 'Complexes', value: properties.filter(p => p.type === 'Complex').length, color: '#7f8fc8' },
  ];
  const totalType = propertyTypes.reduce((s, x) => s + x.value, 0);
  const rentStatus = [
    { label: 'Paid', value: stats.rentCollected, color: '#214a91' },
    { label: 'Due Soon', value: stats.rentPending, color: '#e0a83b' },
    { label: 'Overdue', value: stats.rentOverdue, color: '#d97979' },
    { label: 'Vacant', value: stats.available, color: '#7f8fc8' },
  ];
  const recent = notifications.slice(0, 4);

  return (
    <div className="dashboard-page">
      <div className="dashboard-topline">
        <div className="welcome-block">
          <div className="welcome-copy"><h1>Good Morning, Admin</h1><p>Here's your property overview</p></div>
        </div>
        <div className="dashboard-actions">
          <button className="today-btn"><Icon name="clock" size={14}/><span>Today</span><b>{now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</b></button>
          <button className="property-filter" onClick={() => setPage('properties')}><Icon name="building" size={14}/> All Properties</button>
        </div>
      </div>

      <div className="reference-stats">
        <StatCard icon="building" label="Total Properties" value={stats.total} sub={stats.total ? `${stats.total} properties on record` : 'No properties yet'} tone="gold" />
        <StatCard icon="users" label="Occupied Properties" value={stats.occupied} sub={stats.total ? `${Math.round(stats.occupied / stats.total * 100)}% occupancy` : '0% occupancy'} tone="green" />
        <StatCard icon="home" label="Vacant Properties" value={stats.available} sub={stats.total ? `${Math.round(stats.available / stats.total * 100)}% vacant` : '0% vacant'} tone="purple" />
        <StatCard icon="users" label="Total Tenants" value={stats.totalTenants} sub="Active tenants" tone="blue" />
        <StatCard icon="cash" label="Expected Rent" value={formatCurrency(stats.rentCollected + stats.rentPending + stats.rentOverdue)} sub="This month" tone="purple" />
        <StatCard icon="check" label="Rent Collected" value={formatCurrency(stats.rentCollected)} sub={stats.rentCollected + stats.rentPending + stats.rentOverdue ? `${Math.round(stats.rentCollected/(stats.rentCollected+stats.rentPending+stats.rentOverdue)*100)}% of expected` : '0% of expected'} tone="green" />
        <StatCard icon="clock" label="Rent Pending" value={formatCurrency(stats.rentPending)} sub={stats.rentCollected + stats.rentPending + stats.rentOverdue ? `${Math.round(stats.rentPending/(stats.rentCollected+stats.rentPending+stats.rentOverdue)*100)}% of expected` : '0% of expected'} tone="gold" />
        <StatCard icon="alert" label="Overdue Rent" value={formatCurrency(stats.rentOverdue)} sub={`${tenants.filter(t => (t.rentHistory || []).some(r => r.status === 'Overdue')).length} tenants`} tone="red" />
      </div>

      <div className="dashboard-grid-three">
        <section className="dash-panel property-overview-panel">
          <div className="panel-title"><div><h3>Property Type Overview</h3><p>Total properties by type</p></div></div>
          <div className="donut-layout">
            <DonutChart segments={propertyTypes.filter(x=>x.value>0)} size={112} thickness={18}/>
            <div className="reference-legend">{propertyTypes.map((x)=><div key={x.label}><i style={{background:x.color}}/><span>{x.label}</span><b>{x.value}</b></div>)}</div>
          </div>
        </section>
        <section className="dash-panel monthly-panel">
          <div className="panel-title"><div><h3>Monthly Rent Collection</h3><p>Expected &amp; collected</p></div><div className="mini-legend"><span><i className="expected-dot"/>Expected</span><span><i className="collected-dot"/>Collected</span></div></div>
          <BarChart data={barData} keys={['expected','collected']} colors={['#efb54b','#214a91']} height={145}/>
        </section>
        <section className="dash-panel rent-status-panel">
          <div className="panel-title"><div><h3>Rent Status</h3><p>Current portfolio</p></div></div>
          <div className="rent-status-layout"><DonutChart segments={rentStatus.filter(x=>x.value>0)} size={116} thickness={18} centerText={formatCompactCurrency(rentStatus.reduce((sum, x) => sum + Number(x.value || 0), 0))}/><div className="reference-legend">{rentStatus.map((x)=><div key={x.label}><i style={{background:x.color}}/><span>{x.label}</span><b>{x.value}</b></div>)}</div></div>
        </section>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="dash-panel quick-panel">
          <div className="panel-title"><div><h3>Quick Actions</h3><p>Get things done faster</p></div></div>
          <div className="quick-actions">
            <button title="Add Property" onClick={()=>setPage('properties')}>
              <span className="quick-action-icon"><Icon name="building"/></span>
              <span className="quick-action-label">Add Property</span>
              <span className="quick-action-arrow">→</span>
            </button>
            <button title="Add Tenant" onClick={()=>setPage('tenants')}>
              <span className="quick-action-icon"><Icon name="users"/></span>
              <span className="quick-action-label">Add Tenant</span>
              <span className="quick-action-arrow">→</span>
            </button>
            <button title="Record Rent" onClick={()=>setPage('rent')}>
              <span className="quick-action-icon"><Icon name="cash"/></span>
              <span className="quick-action-label">Record Rent</span>
              <span className="quick-action-arrow">→</span>
            </button>
            <button title="Tenant Messages" onClick={()=>setPage('tenants')}>
              <span className="quick-action-icon"><Icon name="phone"/></span>
              <span className="quick-action-label">Tenant Messages</span>
              <span className="quick-action-arrow">→</span>
            </button>
            <button title="Generate Report" onClick={()=>setPage('reports')}>
              <span className="quick-action-icon"><Icon name="file"/></span>
              <span className="quick-action-label">Generate Report</span>
              <span className="quick-action-arrow">→</span>
            </button>
          </div>
        </section>
        <section className="dash-panel activity-panel">
          <div className="panel-title"><h3>Recent Activity</h3><button className="link-btn" onClick={()=>setPage('notifications')}>View All</button></div>
          <div className="reference-activity">
            {recent.length ? recent.map(n=><div className="activity-row" key={n.id}><div className="activity-icon"><Icon name={n.type === 'send' ? 'send' : 'check'} size={13}/></div><div><b>{n.message}</b><span>{formatDate(n.date)}</span></div></div>) : <div className="reference-empty"><Icon name="bell" size={22}/><span>No recent activity</span><small>Activities will appear here once there is data.</small></div>}
          </div>
        </section>
      </div>
    </div>
  );
}
/* =========================================================
   PROPERTIES PAGE
   ========================================================= */
function PropertiesPage({ properties, onAdd, onUpdate, onDelete, onToggleSale, pushToast }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = properties.filter((p) =>
    (typeFilter === 'All' || p.type === typeFilter) &&
    (p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Properties</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}><Icon name="plus" size={16} /> Add property</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><Icon name="search" size={16} /><input placeholder="Search by name or address" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>All</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid-cards">
        {filtered.length === 0 && <EmptyState text="No properties found" actionLabel="Add property" onAction={() => { setEditing(null); setModalOpen(true); }} />}
        {filtered.map((p) => (
          <div className="property-card" key={p.id}>
            <div className="property-card-top">
              <Badge text={p.type} tone="info" />
              <Badge text={p.status} tone={p.status === 'Occupied' ? 'success' : 'default'} />
            </div>
            <h3>{p.name}</h3>
            <p className="muted small"><Icon name="mapPin" size={13} /> {p.address}, {p.city}</p>
            <div className="property-stats">
              <span>{p.carpetArea || p.plotArea || '—'} sqft</span>
              <span>{p.rentAmount ? `${formatCurrency(p.rentAmount)}/mo` : '—'}</span>
            </div>
            <div className="property-card-actions">
              <button className="icon-btn" title="Edit" onClick={() => { setEditing(p); setModalOpen(true); }}><Icon name="edit" size={15} /></button>
              <button className={`btn btn-xs ${p.forSale ? 'btn-warning' : 'btn-outline'}`} onClick={() => onToggleSale(p.id)}>{p.forSale ? 'Listed ✓' : 'List for sale'}</button>
              <button className="icon-btn danger" title="Delete" onClick={() => setConfirmDelete(p)}><Icon name="trash" size={15} /></button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <Modal title={editing ? 'Edit property' : 'Add property'} onClose={() => setModalOpen(false)} wide>
          <PropertyForm
            initial={editing}
            onCancel={() => setModalOpen(false)}
            pushToast={pushToast}
            onSave={async (obj) => {
              try {
                if (editing) {
                  onUpdate(obj);
                  pushToast('Property updated');
                } else {
                  await onAdd(obj);
                  pushToast('Property added successfully');
                }
                setModalOpen(false);
              } catch (error) {
                console.error('Property save error:', error);
                pushToast(error.message || 'Failed to save property', 'danger');
              }
            }}
          />
        </Modal>
      )}
      {confirmDelete && (
        <ConfirmDialog title="Delete property" message={`Delete ${confirmDelete.name}? This cannot be undone.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => { onDelete(confirmDelete.id); pushToast('Property deleted', 'danger'); setConfirmDelete(null); }} />
      )}
    </div>
  );
}

/* =========================================================
   TENANTS PAGE
   ========================================================= */
function TenantsPage({ tenants, properties, onAdd, onUpdate, onArchive, onRestore, pushToast, sendMessage }) {
  const [query, setQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [historyOf, setHistoryOf] = useState(null);
  const [detailOf, setDetailOf] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(null);

  const list = tenants
    .filter((t) => (showArchived ? t.status === 'Archived' : t.status !== 'Archived'))
    .filter((t) => buildingFilter === 'All' || t.propertyId === buildingFilter)
    .filter((t) => t.fullName.toLowerCase().includes(query.toLowerCase()) || t.phone.includes(query));

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tenants</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}><Icon name="plus" size={16} /> Add tenant</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><Icon name="search" size={16} /><input placeholder="Search by name or phone" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}>
          <option value="All">All buildings</option>
          {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <label className="checkbox toggle-archived"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show previous tenants</label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tenant</th><th>Property</th><th>Phone</th><th>Rent</th><th>Advance</th><th>Date of coming</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="8"><EmptyState text="No tenants found" /></td></tr>}
            {list.map((t) => (
              <tr key={t.id}>
                <td>{t.fullName}</td>
                <td>{getPropertyName(properties, t.propertyId)}</td>
                <td>{t.phone}</td>
                <td>{formatCurrency(t.rentAmount)}</td>
                <td>{formatCurrency(t.advanceAmount)}</td>
                <td>{formatDate(t.dateOfComing)}</td>
                <td><Badge text={t.status} tone={t.status === 'Active' ? 'success' : 'default'} /></td>
                <td className="row-actions">
                  <button className="icon-btn" title="View details" onClick={() => setDetailOf(t)}><Icon name="eye" size={15} /></button>
                  <button className="icon-btn" title="Rent history" onClick={() => setHistoryOf(t)}><Icon name="clock" size={15} /></button>
                  <button className="icon-btn" title="Edit" onClick={() => { setEditing(t); setModalOpen(true); }}><Icon name="edit" size={15} /></button>
                  <button className="icon-btn" title="Send reminder" onClick={() => { sendMessage(t, 'Friendly rent reminder'); pushToast('Message sent to ' + t.fullName); }}><Icon name="send" size={15} /></button>
                  {t.status !== 'Archived'
                    ? <button className="icon-btn" title="Archive" onClick={() => setConfirmArchive(t)}><Icon name="archive" size={15} /></button>
                    : <button className="icon-btn" title="Restore" onClick={() => { onRestore(t.id); pushToast('Tenant restored'); }}><Icon name="check" size={15} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title={editing ? 'Edit tenant' : 'Add tenant'} onClose={() => setModalOpen(false)} wide>
          <TenantForm initial={editing} properties={properties} pushToast={pushToast} onCancel={() => setModalOpen(false)} onSave={(obj) => {
            if (editing) { onUpdate(obj); pushToast('Tenant updated'); } else { onAdd(obj); pushToast('Tenant added'); }
            setModalOpen(false);
          }} />
        </Modal>
      )}
      {detailOf && (() => {
        const property = properties.find((p) => p.id === detailOf.propertyId);
        const previousTenants = tenants.filter((x) => x.propertyId === detailOf.propertyId && x.status === 'Archived' && x.id !== detailOf.id);
        const docs = detailOf.documents || {};
        return (
          <Modal title={`${detailOf.fullName} — details`} onClose={() => setDetailOf(null)} wide>
            <div className="tenant-detail-grid">
              <div className="detail-card"><h4>Tenant details</h4><p><b>Name:</b> {detailOf.fullName}</p><p><b>Phone:</b> {detailOf.phone || '—'}</p><p><b>Email:</b> {detailOf.email || '—'}</p><p><b>Status:</b> {detailOf.status}</p><p><b>Date of coming:</b> {formatDate(detailOf.dateOfComing)}</p><p><b>Date of leaving:</b> {formatDate(detailOf.dateOfLeaving)}</p></div>
              <div className="detail-card"><h4>Property & owner</h4><p><b>Property:</b> {property?.name || '—'}</p><p><b>Address:</b> {property?.address || '—'}</p><p><b>Owner:</b> {property?.ownerName || '—'}</p><p><b>Owner phone:</b> {property?.ownerPhone || '—'}</p></div>
              <div className="detail-card"><h4>Financial details</h4><p><b>Rent:</b> {formatCurrency(detailOf.rentAmount)}</p><p><b>Advance:</b> {formatCurrency(detailOf.advanceAmount)}</p><p><b>Maintenance:</b> {formatCurrency(detailOf.maintenanceFee)}</p><p><b>Brokerage:</b> {formatCurrency(detailOf.brokerageFee)}</p></div>
              <div className="detail-card"><h4>Tenant documents</h4>
                {[['idProof','ID proof'],['addressProof','Address proof'],['panProof','PAN proof']].map(([key,label]) => { const doc=normalizeDocumentValue(docs[key]); return <div className="doc-view-row" key={key}><span>{label} — {documentStatus(doc)}</span><span className="doc-actions">{viewableDocument(doc) && <button className="btn btn-xs btn-outline" onClick={() => setViewDocument({doc,title:`${detailOf.fullName} — ${label}`})}>View</button>} {doc?.dataUrl && <button className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}>Download</button>}</span></div>; })}
              </div>
              <div className="detail-card"><h4>Additional tenant documents</h4>
                {(detailOf.documentsList || []).length === 0 ? <p className="muted">No additional documents uploaded.</p> : detailOf.documentsList.map((doc) => <div className="doc-view-row" key={doc.id || doc.name}><span>{doc.name}</span><span className="doc-actions">{viewableDocument(doc) && <button className="btn btn-xs btn-outline" onClick={() => setViewDocument({doc,title:`${detailOf.fullName} — ${doc.name}`})}>View</button>} {doc?.dataUrl && <button className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}>Download</button>}</span></div>)}
              </div>
              <div className="detail-card"><h4>Property owner documents</h4>
                {['identity','ownership','addressProof'].map((key) => { const labels={identity:'Owner ID proof',ownership:'Ownership / title document',addressProof:'Owner address proof'}; const doc=normalizeDocumentValue(property?.ownerDocuments?.[key]); return <div className="doc-view-row" key={key}><span>{labels[key]} — {documentStatus(doc)}</span><span className="doc-actions">{viewableDocument(doc) && <button className="btn btn-xs btn-outline" onClick={() => setViewDocument({doc,title:`${property?.ownerName || 'Owner'} — ${labels[key]}`})}>View</button>} {doc?.dataUrl && <button className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}>Download</button>}</span></div>; })}
              </div>
              <div className="detail-card"><h4>Additional owner documents</h4>
                {(property?.ownerDocumentsList || []).length === 0 ? <p className="muted">No additional owner documents uploaded.</p> : property.ownerDocumentsList.map((doc) => <div className="doc-view-row" key={doc.id || doc.name}><span>{doc.name}</span><span className="doc-actions">{viewableDocument(doc) && <button className="btn btn-xs btn-outline" onClick={() => setViewDocument({doc,title:`${property?.ownerName || 'Owner'} — ${doc.name}`})}>View</button>} {doc?.dataUrl && <button className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}>Download</button>}</span></div>)}
              </div>
              <div className="detail-card"><h4>Property documents</h4>
                {(property?.propertyDocumentsList || []).length === 0 ? <p className="muted">No additional property documents uploaded.</p> : property.propertyDocumentsList.map((doc) => <div className="doc-view-row" key={doc.id || doc.name}><span>{doc.name}</span><span className="doc-actions">{viewableDocument(doc) && <button className="btn btn-xs btn-outline" onClick={() => setViewDocument({doc,title:`${property.name} — ${doc.name}`})}>View</button>} {doc?.dataUrl && <button className="btn btn-xs btn-outline" onClick={() => downloadDocument(doc)}>Download</button>}</span></div>)}
              </div>
              <div className="detail-card"><h4>Previous tenants for this property</h4>
                {previousTenants.length === 0 ? <p className="muted">No previous tenant records for this property.</p> : previousTenants.map((prev) => <div className="previous-tenant-row" key={prev.id}><span><b>{prev.fullName}</b><small>{formatDate(prev.dateOfComing)} → {formatDate(prev.dateOfLeaving)}</small></span><button className="btn btn-xs btn-outline" onClick={() => setDetailOf(prev)}>View</button></div>)}
              </div>
            </div>
            <div className="modal-footer-inline"><button className="btn btn-primary" onClick={() => downloadTextFile(`${detailOf.fullName.replace(/\s+/g,'-')}-details.txt`, recordAsDownloadText(`${detailOf.fullName} — tenant details`, detailOf))}><Icon name="download" size={15}/> Download tenant details</button></div>
            {viewDocument && <DocumentViewer documentRecord={viewDocument.doc} title={viewDocument.title} onClose={() => setViewDocument(null)} />}
          </Modal>
        );
      })()}
      {historyOf && (
        <Modal title={`Rent history — ${historyOf.fullName}`} onClose={() => setHistoryOf(null)}>
          <div className="rent-history-toolbar">
            <span className="muted">All recorded rent transactions for this tenant.</span>
            <button className="btn btn-outline btn-sm" onClick={() => downloadRentHistoryPDF(historyOf, properties.find((p) => p.id === historyOf.propertyId))}><Icon name="download" size={14}/> PDF</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid on</th></tr></thead>
              <tbody>
                {(historyOf.rentHistory || []).map((r, i) => (
                  <tr key={i}><td>{r.month} {r.year}</td><td>{formatCurrency(r.amount)}</td>
                    <td><Badge text={r.status} tone={r.status === 'Paid' ? 'success' : r.status === 'Overdue' ? 'danger' : 'warning'} /></td>
                    <td>{r.paidDate ? formatDate(r.paidDate) : '—'}</td></tr>
                ))}
                {(!historyOf.rentHistory || historyOf.rentHistory.length === 0) && <tr><td colSpan="4"><EmptyState text="No rent history yet" /></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="summary-row">
            <span>Advance paid: <b>{formatCurrency(historyOf.advanceAmount)}</b></span>
            <span>Brokerage fee: <b>{formatCurrency(historyOf.brokerageFee)}</b></span>
            <span>Maintenance fee: <b>{formatCurrency(historyOf.maintenanceFee)}</b></span>
          </div>
          <div className="modal-footer-inline">
            <button className="btn btn-primary" onClick={() => downloadRentHistoryPDF(historyOf, properties.find((p) => p.id === historyOf.propertyId))}><Icon name="download" size={15}/> Save rent history as PDF</button>
          </div>
        </Modal>
      )}
      {confirmArchive && (
        <ConfirmDialog title="Archive tenant" message={`Archive ${confirmArchive.fullName}? You can restore them or add a new tenant to this property later.`}
          onCancel={() => setConfirmArchive(null)}
          onConfirm={() => { onArchive(confirmArchive.id); pushToast('Tenant archived'); setConfirmArchive(null); }} />
      )}
    </div>
  );
}

/* =========================================================
   RENT PAGE
   ========================================================= */
function RentPage({ tenants, properties, onMarkPaid, sendMessage, pushToast }) {
  const [monthFilter, setMonthFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [showPrevious, setShowPrevious] = useState(false);

  const rows = [];
  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const currentYear = now.getFullYear();
  tenants.forEach((t) => {
    if (!showPrevious && t.status === 'Archived') return;
    if (showPrevious && t.status !== 'Archived') return;
    if (!(t.rentHistory || []).length) {
      rows.push({ tenantId: t.id, tenantName: t.fullName, propertyId: t.propertyId, idx: -1, month: currentMonth, year: currentYear, amount: Number(t.rentAmount || 0), status: 'Pending' });
    } else {
      (t.rentHistory || []).forEach((r, idx) => rows.push({ tenantId: t.id, tenantName: t.fullName, propertyId: t.propertyId, idx, ...r, tenantStatus: t.status }));
    }
  });

  const filtered = rows.filter((r) =>
    (monthFilter === 'All' || r.month === monthFilter) &&
    (statusFilter === 'All' || r.status === statusFilter) &&
    (buildingFilter === 'All' || r.propertyId === buildingFilter)
  );

  return (
    <div className="page">
      <div className="page-header"><div><h2>Rent collection</h2><p className="muted">Track current and previous tenant rent records.</p></div></div>
      <div className="toolbar rent-toolbar">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}><option>All</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All</option><option>Paid</option><option>Pending</option><option>Overdue</option></select>
        <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}><option value="All">All buildings</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <label className="checkbox previous-rent-toggle"><input type="checkbox" checked={showPrevious} onChange={(e) => setShowPrevious(e.target.checked)} /> Previous tenants</label>
      </div>
      <div className="rent-mode-note">{showPrevious ? 'Showing archived / previous tenant rent history.' : 'Showing active tenant rent history.'}</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tenant</th><th>Property</th><th>Month</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan="6"><EmptyState text={showPrevious ? 'No previous tenant rent records' : 'No current rent records'} /></td></tr>}
            {filtered.map((r, i) => {
              const tenant = tenants.find((t) => t.id === r.tenantId);
              const property = properties.find((p) => p.id === r.propertyId);
              return <tr key={`${r.tenantId}-${r.idx}-${i}`}>
                <td><div className="rent-tenant-cell"><strong>{r.tenantName}</strong>{showPrevious && <span className="muted small">Previous tenant</span>}</div></td>
                <td>{getPropertyName(properties, r.propertyId)}</td><td>{r.month} {r.year}</td><td>{formatCurrency(r.amount)}</td>
                <td><Badge text={r.status} tone={r.status === 'Paid' ? 'success' : r.status === 'Overdue' ? 'danger' : 'warning'} /></td>
                <td className="row-actions rent-row-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => downloadRentHistoryPDF(tenant, property)}><Icon name="download" size={14}/> PDF</button>
                  {!showPrevious && r.status !== 'Paid' && <button className="btn btn-sm btn-success" onClick={() => { onMarkPaid(r.tenantId, r.idx); pushToast('Marked as paid and WhatsApp message prepared'); }}>Mark paid</button>}
                  {!showPrevious && r.status !== 'Paid' && <button className="btn btn-sm btn-outline" onClick={() => { sendMessage(tenant, `Rent of ${formatCurrency(r.amount)} for ${r.month} is due`); pushToast('Reminder prepared'); }}>Remind</button>}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   BILLS PAGE
   ========================================================= */
function BillsPage({ bills, properties, onAdd, onMarkPaid, pushToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ propertyId: '', amount: '', month: MONTHS[new Date().getMonth()], dueDate: '' });

  function submit(e) {
    e.preventDefault();
    if (!form.propertyId || !form.amount) return;
    onAdd({ ...form, id: uid(), status: 'Pending' });
    pushToast('Bill added'); setModalOpen(false);
    setForm({ propertyId: '', amount: '', month: MONTHS[new Date().getMonth()], dueDate: '' });
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Electricity bills</h2><button className="btn btn-primary" onClick={() => setModalOpen(true)}><Icon name="plus" size={16} /> Add bill</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Property</th><th>Month</th><th>Amount</th><th>Due date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {bills.length === 0 && <tr><td colSpan="6"><EmptyState text="No bills yet" /></td></tr>}
            {bills.map((b) => (
              <tr key={b.id}>
                <td>{getPropertyName(properties, b.propertyId)}</td><td>{b.month}</td><td>{formatCurrency(b.amount)}</td><td>{formatDate(b.dueDate)}</td>
                <td><Badge text={b.status} tone={b.status === 'Paid' ? 'success' : 'warning'} /></td>
                <td>{b.status !== 'Paid' && <button className="btn btn-sm btn-success" onClick={() => { onMarkPaid(b.id); pushToast('Bill marked paid'); }}>Mark paid</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Add electricity bill" onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={submit}>
            <div className="form-grid">
              <label className="span-2">Property *<select required value={form.propertyId} onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}><option value="">Select</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label>Month<select value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select></label>
              <label>Amount (₹) *<input required type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} /></label>
              <label>Due date<input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} /></label>
            </div>
            <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add bill</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   MAINTENANCE PAGE
   ========================================================= */
function MaintenancePage({ requests, properties, onAdd, onStatusChange, pushToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ propertyId: '', title: '', cost: '' });
  const columns = ['Pending', 'In Progress', 'Resolved'];

  function submit(e) {
    e.preventDefault();
    if (!form.propertyId || !form.title) return;
    onAdd({ ...form, id: uid(), status: 'Pending', date: new Date().toISOString() });
    pushToast('Maintenance request added'); setModalOpen(false);
    setForm({ propertyId: '', title: '', cost: '' });
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Maintenance</h2><button className="btn btn-primary" onClick={() => setModalOpen(true)}><Icon name="plus" size={16} /> New request</button></div>
      <div className="kanban">
        {columns.map((col) => (
          <div className="kanban-col" key={col}>
            <h4>{col} <span className="count">{requests.filter((r) => r.status === col).length}</span></h4>
            {requests.filter((r) => r.status === col).map((r) => (
              <div className="kanban-card" key={r.id}>
                <strong>{r.title}</strong>
                <span className="muted small">{getPropertyName(properties, r.propertyId)}</span>
                {r.cost ? <span className="muted small">Cost: {formatCurrency(r.cost)}</span> : null}
                <div className="kanban-actions">
                  {col !== 'Pending' && <button onClick={() => onStatusChange(r.id, columns[columns.indexOf(col) - 1])}>← Back</button>}
                  {col !== 'Resolved' && <button onClick={() => { onStatusChange(r.id, columns[columns.indexOf(col) + 1]); pushToast('Status updated'); }}>Next →</button>}
                </div>
              </div>
            ))}
            {requests.filter((r) => r.status === col).length === 0 && <p className="muted small">No requests</p>}
          </div>
        ))}
      </div>
      {modalOpen && (
        <Modal title="New maintenance request" onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={submit}>
            <div className="form-grid">
              <label className="span-2">Property *<select required value={form.propertyId} onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}><option value="">Select</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label className="span-2">Issue title *<input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></label>
              <label>Estimated cost (₹)<input type="number" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} /></label>
            </div>
            <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   STORAGE PAGE
   ========================================================= */
function StoragePage({ storageFees, properties, onAdd, onMarkPaid, pushToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ propertyId: '', itemDescription: '', amount: '', month: MONTHS[new Date().getMonth()] });
  const godowns = properties.filter((p) => p.type === 'Godown');

  function submit(e) {
    e.preventDefault();
    if (!form.propertyId || !form.amount) return;
    onAdd({ ...form, id: uid(), status: 'Pending' });
    pushToast('Storage fee added'); setModalOpen(false);
    setForm({ propertyId: '', itemDescription: '', amount: '', month: MONTHS[new Date().getMonth()] });
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Storage fees</h2><button className="btn btn-primary" onClick={() => setModalOpen(true)}><Icon name="plus" size={16} /> Add storage fee</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Godown</th><th>Description</th><th>Month</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {storageFees.length === 0 && <tr><td colSpan="6"><EmptyState text="No storage fees recorded" /></td></tr>}
            {storageFees.map((s) => (
              <tr key={s.id}>
                <td>{getPropertyName(properties, s.propertyId)}</td><td>{s.itemDescription}</td><td>{s.month}</td><td>{formatCurrency(s.amount)}</td>
                <td><Badge text={s.status} tone={s.status === 'Paid' ? 'success' : 'warning'} /></td>
                <td>{s.status !== 'Paid' && <button className="btn btn-sm btn-success" onClick={() => { onMarkPaid(s.id); pushToast('Marked as paid'); }}>Mark paid</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title="Add storage fee" onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={submit}>
            <div className="form-grid">
              <label className="span-2">Godown *<select required value={form.propertyId} onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}><option value="">Select</option>{(godowns.length ? godowns : properties).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label className="span-2">Description<input value={form.itemDescription} onChange={(e) => setForm((f) => ({ ...f, itemDescription: e.target.value }))} /></label>
              <label>Month<select value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select></label>
              <label>Amount (₹) *<input required type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} /></label>
            </div>
            <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   REPORTS PAGE
   ========================================================= */
function ReportsPage({ tenants, properties }) {
  const [tab, setTab] = useState('Rent');
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('All');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [paidFilter, setPaidFilter] = useState('All');

  let rows = [];
  if (tab === 'Rent') {
    tenants.forEach((t) => {
      if (t.status === 'Archived') return;
      (t.rentHistory || []).forEach((r) => rows.push({ Tenant: t.fullName, Property: getPropertyName(properties, t.propertyId), Month: r.month, Year: r.year, Amount: r.amount, Status: r.status, propertyId: t.propertyId }));
    });
  } else if (tab === 'Tenants') {
    rows = tenants.map((t) => ({ Tenant: t.fullName, Property: getPropertyName(properties, t.propertyId), Phone: t.phone, 'Date of coming': t.dateOfComing, 'Date of leaving': t.dateOfLeaving || '-', Status: t.status, propertyId: t.propertyId }));
  } else {
    rows = tenants.map((t) => ({ Tenant: t.fullName, Property: getPropertyName(properties, t.propertyId), Advance: t.advanceAmount, Brokerage: t.brokerageFee, Maintenance: t.maintenanceFee, propertyId: t.propertyId }));
  }

  const filtered = rows.filter((r) =>
    (tab !== 'Rent' || month === 'All' || r.Month === month) &&
    (buildingFilter === 'All' || r.propertyId === buildingFilter) &&
    (tab !== 'Rent' || paidFilter === 'All' || r.Status === paidFilter)
  );
  const columns = filtered[0] ? Object.keys(filtered[0]).filter((k) => k !== 'propertyId') : [];

  function exportCSV() {
    if (filtered.length === 0) return;
    const clean = filtered.map((r) => { const { propertyId, ...rest } = r; return rest; });
    const headers = Object.keys(clean[0]);
    const csv = [headers.join(','), ...clean.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${tab.toLowerCase()}-report-${year}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Reports</h2></div>
      <div className="tabs">
        {['Rent', 'Tenants', 'Advance'].map((tb) => (<button key={tb} className={tab === tb ? 'active' : ''} onClick={() => setTab(tb)}>{tb}</button>))}
      </div>
      <div className="toolbar">
        <select value={year} onChange={(e) => setYear(e.target.value)}>{['2024', '2025', '2026', '2027'].map((y) => <option key={y}>{y}</option>)}</select>
        {tab === 'Rent' && <select value={month} onChange={(e) => setMonth(e.target.value)}><option>All</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select>}
        <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}><option value="All">All buildings</option>{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        {tab === 'Rent' && <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)}><option value="All">All</option><option>Paid</option><option>Pending</option><option>Overdue</option></select>}
        <button className="btn btn-outline" onClick={exportCSV}><Icon name="download" size={16} /> Export CSV</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={columns.length || 1}><EmptyState text="No data found" /></td></tr>}
            {filtered.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c}>
                    {['Amount', 'Advance', 'Brokerage', 'Maintenance'].includes(c) ? formatCurrency(r[c])
                      : c === 'Status' ? <Badge text={r[c]} tone={r[c] === 'Paid' || r[c] === 'Active' ? 'success' : r[c] === 'Overdue' ? 'danger' : 'warning'} />
                      : (r[c] || '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   SERVICES PAGE
   ========================================================= */
/* =========================================================
   NOTIFICATIONS PAGE
   ========================================================= */
function NotificationsPage({ notifications, onMarkRead, onMarkAllRead }) {
  return (
    <div className="page">
      <div className="page-header"><h2>Notifications</h2><button className="btn btn-outline btn-sm" onClick={onMarkAllRead}>Mark all read</button></div>
      <div className="notif-list page-notif-list">
        {notifications.length === 0 && <EmptyState text="No notifications" />}
        {notifications.map((n) => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => onMarkRead(n.id)}>
            <Icon name={n.type === 'send' ? 'send' : 'alert'} size={17} />
            <div><p>{n.message}</p><span className="muted small">{formatDate(n.date)}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS PAGE
   ========================================================= */
function SettingsPage({ managers, onAddManager, onRemoveManager, properties, onToggleListed, onToggleSale, notifPrefs, setNotifPrefs, pushToast, onDeleteAllData, onNavigate, adminProfile, onSaveProfile }) {
  const [section, setSection] = useState(null);
  const [managerForm, setManagerForm] = useState({ name: '', phone: '', role: 'Manager' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profile, setProfile] = useState(() => ({ name: '', email: '', phone: '', bankName: '', accountNumber: '', ifsc: '', profilePhoto: null, ...(adminProfile || {}) }));
  const [lang, setLang] = useState('English');
  const [currency, setCurrency] = useState('INR (₹)');

  const items = [
    { key: 'profile', icon: 'users', label: 'Profile & bank details' },
    { key: 'buildings', icon: 'building', label: 'Add buildings / flats' },
    { key: 'tenants', icon: 'users', label: 'Assign tenant' },
    { key: 'tolet', icon: 'mapPin', label: 'Online to-let listings' },
    { key: 'managers', icon: 'users', label: 'Add / manage managers' },
    { key: 'sale', icon: 'cash', label: 'Sale online flat / property' },
    { key: 'language', icon: 'settings', label: 'Language & internationalization' },
    { key: 'notif', icon: 'bell', label: 'Notification settings' },
    { key: 'delete', icon: 'trash', label: 'Delete account' },
  ];

  function toggleSection(key) {
    setSection((current) => (current === key ? null : key));
  }

  function addManager(e) {
    e.preventDefault();
    const name = managerForm.name.trim();
    if (!name) {
      pushToast('Manager name is required', 'danger');
      return;
    }
    onAddManager({ ...managerForm, name, id: uid() });
    pushToast('Manager added');
    setManagerForm({ name: '', phone: '', role: 'Manager' });
  }

  function renderSection(sectionKey) {
    if (sectionKey === 'profile') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Profile &amp; bank details</h4>
          <form className="form" onSubmit={(e) => { e.preventDefault(); if (onSaveProfile) onSaveProfile(profile); else pushToast('Profile saved'); }}>
            <div className="admin-profile-editor">
              <div className="admin-profile-preview">
                {profile.profilePhoto ? <img src={profile.profilePhoto} alt="Admin profile" /> : <Icon name="user" size={30} />}
              </div>
              <div className="admin-profile-upload">
                <strong>Admin profile photo</strong>
                <span>JPG, PNG or WEBP</span>
                <label className="file-upload-btn btn btn-outline btn-sm">
                  <input type="file" accept="image/*" onChange={async (e) => { const rec = await makeDocumentRecord(e.target.files?.[0], { imageOnly: true, maxBytes: PROFILE_PHOTO_MAX_BYTES }); if (rec?.dataUrl) setProfile((p) => ({ ...p, profilePhoto: rec.dataUrl })); }} />
                  {profile.profilePhoto ? 'Change photo' : 'Choose photo'}
                </label>
              </div>
            </div>
            <div className="form-grid">
              <label>Full name<input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} /></label>
              <label>Email<input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} /></label>
              <label>Phone<input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} /></label>
              <label>Bank name<input value={profile.bankName} onChange={(e) => setProfile((p) => ({ ...p, bankName: e.target.value }))} /></label>
              <label>Account number<input value={profile.accountNumber} onChange={(e) => setProfile((p) => ({ ...p, accountNumber: e.target.value }))} /></label>
              <label>IFSC code<input value={profile.ifsc} onChange={(e) => setProfile((p) => ({ ...p, ifsc: e.target.value }))} /></label>
            </div>
            <div className="form-actions"><button className="btn btn-primary" type="submit">Save</button></div>
          </form>
        </div>
      );
    }

    if (sectionKey === 'buildings') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Buildings overview</h4>
          <p className="muted">{properties.length} properties are currently on record. Add or edit buildings and flats from Properties.</p>
          <div className="settings-action-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('properties')}>Open Properties</button>
          </div>
        </div>
      );
    }

    if (sectionKey === 'tenants') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Assign tenant</h4>
          <p className="muted">Open Tenants to add a tenant or assign an existing tenant to a property unit.</p>
          <div className="settings-action-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('tenants')}>Open Tenants</button>
          </div>
        </div>
      );
    }

    if (sectionKey === 'tolet') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Online to-let listings</h4>
          {properties.length === 0 ? (
            <EmptyState text="No properties available" />
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Property</th><th>Type</th><th>Listed</th></tr></thead>
                <tbody>{properties.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name || 'Unnamed property'}</td><td>{p.type || '—'}</td>
                    <td><label className="switch"><input type="checkbox" checked={!!p.listed} onChange={() => onToggleListed(p.id)} /><span className="slider" /></label></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'managers') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Add / manage managers</h4>
          <form className="form-inline" onSubmit={addManager}>
            <input placeholder="Name" value={managerForm.name} onChange={(e) => setManagerForm((f) => ({ ...f, name: e.target.value }))} />
            <input placeholder="Phone" value={managerForm.phone} onChange={(e) => setManagerForm((f) => ({ ...f, phone: e.target.value }))} />
            <select value={managerForm.role} onChange={(e) => setManagerForm((f) => ({ ...f, role: e.target.value }))}><option>Manager</option><option>Supervisor</option><option>Accountant</option></select>
            <button className="btn btn-primary btn-sm" type="submit"><Icon name="plus" size={14} /> Add</button>
          </form>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Phone</th><th>Role</th><th></th></tr></thead>
              <tbody>
                {managers.length === 0 && <tr><td colSpan="4"><EmptyState text="No managers yet" /></td></tr>}
                {managers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td><td>{m.phone || '—'}</td><td>{m.role}</td>
                    <td><button type="button" className="icon-btn danger" onClick={() => { onRemoveManager(m.id); pushToast('Manager removed'); }}><Icon name="trash" size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (sectionKey === 'sale') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Sale online flat / property</h4>
          {properties.length === 0 ? (
            <EmptyState text="No properties available" />
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Property</th><th>Expected price</th><th>Listed for sale</th></tr></thead>
                <tbody>{properties.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name || 'Unnamed property'}</td><td>{p.expectedPrice ? formatCurrency(p.expectedPrice) : '—'}</td>
                    <td><label className="switch"><input type="checkbox" checked={!!p.forSale} onChange={() => onToggleSale(p.id)} /><span className="slider" /></label></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'language') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Language &amp; internationalization</h4>
          <div className="form-grid">
            <label>Language<select value={lang} onChange={(e) => setLang(e.target.value)}><option>English</option><option>Tamil</option><option>Hindi</option><option>Telugu</option></select></label>
            <label>Currency<select value={currency} onChange={(e) => setCurrency(e.target.value)}><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select></label>
          </div>
          <div className="settings-action-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => pushToast(`Language: ${lang} • Currency: ${currency}`)}>Apply</button>
          </div>
        </div>
      );
    }

    if (sectionKey === 'notif') {
      return (
        <div className="settings-panel settings-panel-inline">
          <h4>Notification settings</h4>
          {Object.keys(notifPrefs).map((k) => (
            <div className="pref-row" key={k}>
              <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</span>
              <label className="switch"><input type="checkbox" checked={!!notifPrefs[k]} onChange={() => setNotifPrefs((p) => ({ ...p, [k]: !p[k] }))} /><span className="slider" /></label>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === 'delete') {
      return (
        <div className="settings-panel settings-panel-inline settings-danger-panel">
          <h4>Delete account</h4>
          <p className="muted">This will permanently remove all properties, tenants and records from this session.</p>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Delete account</button>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="page settings-page">
      <div className="page-header"><h2>Settings</h2></div>
      <div className="settings-list">
        {items.map((it) => (
          <div key={it.key} className={`settings-section ${section === it.key ? 'open' : ''}`}>
            <button type="button" className="settings-item" onClick={() => toggleSection(it.key)} aria-expanded={section === it.key}>
              <span className="settings-item-left"><Icon name={it.icon} size={17} /> <span>{it.label}</span></span>
              <Icon name="chevronDown" size={16} className={section === it.key ? 'rotated' : ''} />
            </button>
            {section === it.key && renderSection(it.key)}
          </div>
        ))}
      </div>

      {confirmDelete && (
        <ConfirmDialog title="Delete account" message="Are you absolutely sure? This action cannot be undone."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { onDeleteAllData(); setConfirmDelete(false); pushToast('All data cleared', 'danger'); }} />
      )}
    </div>
  );
}

/* =========================================================
   ADMIN AUTHENTICATION — FRONTEND ONLY FOR NOW

   First run:
   - Set one administrator username + strong password.
   Later:
   - Only the administrator login form is shown.
   - No public signup.
   - No forgot-password flow.

   NOTE: This is a browser-side authentication gate. It is suitable for
   the current frontend-only stage. Real strong security must move the
   password verification to the backend/Prisma layer later.
   ========================================================= */
const AUTH_STORAGE_KEY = 'sakthi_admin_auth_v2';
const AUTH_SESSION_KEY = 'sakthi_admin_session_v2';
const AUTH_LOCK_KEY = 'sakthi_admin_lock_v2';
const AUTH_MAX_ATTEMPTS = 5;
const AUTH_LOCK_MS = 60 * 1000;
const AUTH_ITERATIONS = 120000;

function readJsonStorage(storage, key, fallback = null) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derivePasswordVerifier(password, saltHex) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Please use a modern browser.');
  const encoder = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const salt = hexToBytes(saltHex);
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: AUTH_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function generateSalt() {
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure random generation is unavailable.');
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function validateAdminPassword(password) {
  if (password.length < 12) return 'Password must be at least 12 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return '';
}

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function getStoredAdmin() {
  return readJsonStorage(localStorage, AUTH_STORAGE_KEY, null);
}

function isAdminConfigured() {
  const admin = getStoredAdmin();
  return Boolean(admin?.username && admin?.salt && admin?.verifier);
}

function getLockState() {
  return readJsonStorage(localStorage, AUTH_LOCK_KEY, { attempts: 0, lockedUntil: 0 });
}

function saveLockState(state) {
  localStorage.setItem(AUTH_LOCK_KEY, JSON.stringify(state));
}

function clearLockState() {
  localStorage.removeItem(AUTH_LOCK_KEY);
}

function getRemainingLockSeconds() {
  const lock = getLockState();
  return lock.lockedUntil > Date.now() ? Math.ceil((lock.lockedUntil - Date.now()) / 1000) : 0;
}

function AuthPage({ onAuthenticated }) {
  const configured = isAdminConfigured();
  const [mode, setMode] = useState(configured ? 'login' : 'setup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remainingLock, setRemainingLock] = useState(getRemainingLockSeconds());

  useEffect(() => {
    if (!remainingLock) return undefined;
    const timer = setInterval(() => setRemainingLock(getRemainingLockSeconds()), 1000);
    return () => clearInterval(timer);
  }, [remainingLock]);

  function clearMessages() {
    setError('');
    setMessage('');
  }

  async function setupAdmin(e) {
    e.preventDefault();
    clearMessages();
    const cleanUsername = normalizeUsername(username);
    if (!/^[a-z0-9._-]{4,32}$/.test(cleanUsername)) {
      setError('Username must be 4–32 characters and use only letters, numbers, dot, underscore or hyphen.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const passwordError = validateAdminPassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setBusy(true);
    try {
      const salt = generateSalt();
      const verifier = await derivePasswordVerifier(password, salt);
      const admin = {
        username: cleanUsername,
        salt,
        verifier,
        createdAt: new Date().toISOString(),
        role: 'Administrator'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
      clearLockState();
      setPassword('');
      setConfirmPassword('');
      setMode('login');
      setMessage('Administrator account created. Sign in to continue.');
    } catch (err) {
      setError(err.message || 'Unable to create the administrator account.');
    } finally {
      setBusy(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    clearMessages();
    const lockSeconds = getRemainingLockSeconds();
    if (lockSeconds > 0) {
      setRemainingLock(lockSeconds);
      setError(`Too many failed attempts. Try again in ${lockSeconds}s.`);
      return;
    }
    const admin = getStoredAdmin();
    if (!admin) {
      setMode('setup');
      setError('Administrator credentials are not configured.');
      return;
    }
    const cleanUsername = normalizeUsername(username);
    if (!cleanUsername || !password) {
      setError('Enter your administrator username and password.');
      return;
    }
    setBusy(true);
    try {
      const verifier = await derivePasswordVerifier(password, admin.salt);
      if (cleanUsername !== admin.username || verifier !== admin.verifier) {
        const state = getLockState();
        const attempts = Number(state.attempts || 0) + 1;
        if (attempts >= AUTH_MAX_ATTEMPTS) {
          saveLockState({ attempts, lockedUntil: Date.now() + AUTH_LOCK_MS });
          setRemainingLock(Math.ceil(AUTH_LOCK_MS / 1000));
        } else {
          saveLockState({ attempts, lockedUntil: 0 });
        }
        setPassword('');
        setError('Invalid administrator username or password.');
        return;
      }
      clearLockState();
      const session = {
        username: admin.username,
        role: 'Administrator',
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      setPassword('');
      onAuthenticated(session);
    } catch (err) {
      setError(err.message || 'Unable to sign in securely.');
    } finally {
      setBusy(false);
    }
  }

  const isSetup = mode === 'setup';
  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-mark"><Icon name="home" size={28} /></div>
        <div className="auth-brand-name"><strong>SAKTHI</strong><span>CONSTRUCTION</span><small>Property &amp; Facility Management</small></div>
        <div className="auth-brand-line" />
        <div className="auth-trust"><Icon name="shield" size={16} /><span>Administrator access only</span></div>
        <div className="auth-footer">Better Properties<br/>Brighter Future</div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-card-head">
            <span className="auth-kicker">SAKTHI CONSTRUCTION</span>
            <h1>{isSetup ? 'Set administrator access' : 'Administrator login'}</h1>
            <p>{isSetup ? 'Create the one administrator account used to access this system.' : 'Sign in to manage your property and facility workspace.'}</p>
          </div>

          {isSetup ? (
            <form className="auth-form" onSubmit={setupAdmin}>
              <label>Administrator username
                <div className="auth-input"><Icon name="user" size={17}/><input autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" /></div>
              </label>
              <label>Password
                <div className="auth-input"><Icon name="lock" size={17}/><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Use 12+ characters" /><button type="button" className="auth-visibility" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility"><Icon name={showPassword ? 'eyeOff' : 'eye'} size={16}/></button></div>
              </label>
              <label>Confirm password
                <div className="auth-input"><Icon name="lock" size={17}/><input type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" /><button type="button" className="auth-visibility" onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirmation visibility"><Icon name={showConfirm ? 'eyeOff' : 'eye'} size={16}/></button></div>
              </label>
              <div className="auth-security-note"><strong>Strong password required</strong><span>12+ characters · uppercase · lowercase · number · special character</span></div>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Securing account…' : 'Set administrator password'} <Icon name="shield" size={17}/></button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={login}>
              <label>Administrator username
                <div className="auth-input"><Icon name="user" size={17}/><input autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" /></div>
              </label>
              <label>Password
                <div className="auth-input"><Icon name="lock" size={17}/><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" /><button type="button" className="auth-visibility" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility"><Icon name={showPassword ? 'eyeOff' : 'eye'} size={16}/></button></div>
              </label>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              {remainingLock > 0 && <div className="auth-security-note"><strong>Temporary sign-in lock</strong><span>Too many failed attempts. Try again in {remainingLock}s.</span></div>}
              <button className="auth-submit" type="submit" disabled={busy || remainingLock > 0}>{busy ? 'Signing in…' : 'Sign in securely'} <Icon name="arrowRight" size={17}/></button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */
export default function App() {
  const [authUser, setAuthUser] = useState(() => readJsonStorage(sessionStorage, AUTH_SESSION_KEY, null));
  const [adminProfile, setAdminProfile] = useState(() => readJsonStorage(localStorage, 'sakthi_admin_profile_v1', { name: 'Administrator', email: '', phone: '', bankName: '', accountNumber: '', ifsc: '', profilePhoto: null }));
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [bills, setBills] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [storageFees, setStorageFees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifPrefs, setNotifPrefs] = useState({ rentReminders: true, maintenanceAlerts: true, newTenantAlerts: true, automaticMessages: true });
  const [toasts, setToasts] = useState([]);
  const [page, setPage] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load properties');
        }

        if (!cancelled) {
          setProperties(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Property loading error:', error);
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  function pushToast(msg, type = 'success') {
    const id = uid();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }
  function pushNotification(message, type = 'alert') {
    setNotifications((n) => [{ id: uid(), message, type, date: new Date().toISOString(), read: false }, ...n]);
  }
  function sendMessage(tenant, text) {
    if (!tenant) return;
    pushNotification(`Message to ${tenant.fullName}: ${text}`, 'send');
  }

  async function addProperty(p) {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save property');
    }

    setProperties((ps) => [data, ...ps]);
    pushNotification(`New property added: ${data.name}`);
    return data;
  }
  function updateProperty(p) { setProperties((ps) => ps.map((x) => (x.id === p.id ? p : x))); }
  function deleteProperty(id) { setProperties((ps) => ps.filter((x) => x.id !== id)); }
  function toggleSale(id) { setProperties((ps) => ps.map((p) => (p.id === id ? { ...p, forSale: !p.forSale } : p))); }
  function toggleListed(id) { setProperties((ps) => ps.map((p) => (p.id === id ? { ...p, listed: !p.listed } : p))); }

  function ensureCurrentRentRecord(t) {
    const existing = Array.isArray(t.rentHistory) ? t.rentHistory : [];
    if (existing.length > 0) return existing;
    const now = new Date();
    return [{ month: MONTHS[now.getMonth()], year: now.getFullYear(), amount: Number(t.rentAmount || 0), status: 'Pending', dueDate: null }];
  }
  function addTenant(t) {
    const tenant = { ...t, rentHistory: ensureCurrentRentRecord(t) };
    const leavingDate = new Date().toISOString().slice(0, 10);
    setTenants((ts) => [
      tenant,
      ...ts.map((existing) => existing.propertyId === tenant.propertyId && existing.status === 'Active'
        ? { ...existing, status: 'Archived', dateOfLeaving: existing.dateOfLeaving || leavingDate }
        : existing)
    ]);
    setProperties((ps) => ps.map((p) => (p.id === tenant.propertyId ? { ...p, status: 'Occupied' } : p)));
    pushNotification(`New tenant added: ${tenant.fullName}`);
  }
  function updateTenant(t) {
    const updated = { ...t, rentHistory: ensureCurrentRentRecord(t) };
    setTenants((ts) => ts.map((x) => (x.id === updated.id ? updated : x)));
  }
  function archiveTenant(id) { setTenants((ts) => ts.map((t) => (t.id === id ? { ...t, status: 'Archived', dateOfLeaving: t.dateOfLeaving || new Date().toISOString().slice(0, 10) } : t))); }
  function restoreTenant(id) { setTenants((ts) => ts.map((t) => (t.id === id ? { ...t, status: 'Active' } : t))); }
  function markRentPaid(tenantId, idx) {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;
    const existing = Array.isArray(tenant.rentHistory) ? tenant.rentHistory : [];
    const source = idx === -1 ? { month: MONTHS[new Date().getMonth()], year: new Date().getFullYear(), amount: Number(tenant.rentAmount || 0) } : (existing[idx] || {});
    const paidAmount = Number(source.amount || 0);
    const paidMonth = source.month || MONTHS[new Date().getMonth()];
    setTenants((ts) => ts.map((t) => {
      if (t.id !== tenantId) return t;
      const history = Array.isArray(t.rentHistory) ? [...t.rentHistory] : [];
      if (idx === -1) {
        history.unshift({ month: paidMonth, year: source.year || new Date().getFullYear(), amount: paidAmount, status: 'Paid', paidDate: new Date().toISOString(), dueDate: null });
      } else if (history[idx]) {
        history[idx] = { ...history[idx], status: 'Paid', paidDate: new Date().toISOString() };
      }
      return { ...t, rentHistory: history };
    }));
    const message = `Hello ${tenant.fullName}, your rent of ${formatCurrency(paidAmount)} for ${paidMonth} has been marked as paid. Thank you - Sakthi Construction.`;
    pushNotification(`Rent paid: ${tenant.fullName} - ${formatCurrency(paidAmount)} for ${paidMonth}`, 'send');
    openWhatsAppForTenant(tenant, message);
  }

  function addBill(b) { setBills((bs) => [b, ...bs]); }
  function markBillPaid(id) { setBills((bs) => bs.map((b) => (b.id === id ? { ...b, status: 'Paid' } : b))); }

  function addMaintenance(m) { setMaintenance((ms) => [m, ...ms]); }
  function changeMaintenanceStatus(id, status) { setMaintenance((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m))); }

  function addStorage(s) { setStorageFees((ss) => [s, ...ss]); }
  function markStoragePaid(id) { setStorageFees((ss) => ss.map((s) => (s.id === id ? { ...s, status: 'Paid' } : s))); }

  function addManager(m) { setManagers((ms) => [m, ...ms]); }
  function removeManager(id) { setManagers((ms) => ms.filter((m) => m.id !== id)); }

  function markRead(id) { setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x))); }
  function markAllRead() { setNotifications((n) => n.map((x) => ({ ...x, read: true }))); }

  function deleteAllData() {
    setProperties([]); setTenants([]); setBills([]); setMaintenance([]); setStorageFees([]); setManagers([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  function saveAdminProfile(nextProfile) {
    const next = { ...(adminProfile || {}), ...(nextProfile || {}) };
    setAdminProfile(next);
    localStorage.setItem('sakthi_admin_profile_v1', JSON.stringify(next));
    setAuthUser((current) => {
      const merged = { ...(current || {}), ...next };
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(merged));
      return merged;
    });
    pushToast('Admin profile updated');
  }

  function logout() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setAuthUser(null);
    setPage('dashboard');
  }

  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const res = [];
    properties.forEach((p) => { if (p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)) res.push({ key: 'p-' + p.id, label: p.name, tag: p.type, icon: 'building', page: 'properties' }); });
    tenants.forEach((t) => { if (t.fullName.toLowerCase().includes(q) || t.phone.includes(q)) res.push({ key: 't-' + t.id, label: t.fullName, tag: 'Tenant', icon: 'users', page: 'tenants' }); });
    return res.slice(0, 8);
  }, [query, properties, tenants]);

  function renderPage() {
    switch (page) {
      case 'dashboard': return <DashboardPage properties={properties} tenants={tenants} bills={bills} storageFees={storageFees} notifications={notifications} setPage={setPage} />;
      case 'properties': return <PropertiesPage properties={properties} onAdd={addProperty} onUpdate={updateProperty} onDelete={deleteProperty} onToggleSale={toggleSale} pushToast={pushToast} />;
      case 'tenants': return <TenantsPage tenants={tenants} properties={properties} onAdd={addTenant} onUpdate={updateTenant} onArchive={archiveTenant} onRestore={restoreTenant} pushToast={pushToast} sendMessage={sendMessage} />;
      case 'rent': return <RentPage tenants={tenants} properties={properties} onMarkPaid={markRentPaid} sendMessage={sendMessage} pushToast={pushToast} />;
      case 'bills': return <BillsPage bills={bills} properties={properties} onAdd={addBill} onMarkPaid={markBillPaid} pushToast={pushToast} />;
      case 'maintenance': return <MaintenancePage requests={maintenance} properties={properties} onAdd={addMaintenance} onStatusChange={changeMaintenanceStatus} pushToast={pushToast} />;
      case 'storage': return <StoragePage storageFees={storageFees} properties={properties} onAdd={addStorage} onMarkPaid={markStoragePaid} pushToast={pushToast} />;
      case 'reports': return <ReportsPage tenants={tenants} properties={properties} />;
      case 'notifications': return <NotificationsPage notifications={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} />;
      case 'settings': return <SettingsPage managers={managers} onAddManager={addManager} onRemoveManager={removeManager} properties={properties} onToggleListed={toggleListed} onToggleSale={toggleSale} notifPrefs={notifPrefs} setNotifPrefs={setNotifPrefs} pushToast={pushToast} onDeleteAllData={deleteAllData} onNavigate={setPage} adminProfile={adminProfile} onSaveProfile={saveAdminProfile} />;
      default: return null;
    }
  }

  if (!authUser) {
    return <AuthPage onAuthenticated={setAuthUser} />;
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} unreadCount={unreadCount} onLogout={logout} />
      <div className="main-area">
        <Topbar query={query} setQuery={setQuery} searchResults={searchResults} onNavigate={setPage}
          notifications={notifications} unreadCount={unreadCount} notifOpen={notifOpen} setNotifOpen={setNotifOpen}
          onMarkRead={markRead} onMarkAllRead={markAllRead} profileOpen={profileOpen} setProfileOpen={setProfileOpen} user={{ ...(authUser || {}), ...(adminProfile || {}) }} onLogout={logout} />
        <main className="content">{renderPage()}</main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
