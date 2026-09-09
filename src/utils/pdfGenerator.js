/**
 * Dynamic 1-Click PDF & Printable Pricelist Generator for Kalishwari Crackers
 */
import { getStoredProducts } from './productManager';

export function downloadPriceListPdf(products = []) {
  const list = products.length > 0 ? products : getStoredProducts();

  // Group products by category
  const categorized = {};
  list.forEach(p => {
    const cat = p.category || 'General';
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(p);
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the price list PDF');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kalishwary Crackers - Official Wholesale Price List 2026</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
          padding: 20px;
          margin: 0;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #D4AF37;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .brand-name {
          font-size: 28px;
          font-weight: 800;
          color: #8e0000;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .sub-title {
          font-size: 14px;
          color: #666;
          margin-top: 4px;
        }
        .meta-bar {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #555;
          margin-bottom: 15px;
          background: #fdfaf0;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #f3e5ab;
        }
        .cat-title {
          background: linear-gradient(90deg, #8e0000, #c62828);
          color: #ffffff;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 4px;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #e0e0e0;
          padding: 8px 10px;
          text-align: left;
        }
        th {
          background: #f5f5f5;
          color: #333;
          font-weight: 600;
        }
        .price {
          font-weight: bold;
          color: #2e7d32;
        }
        .strike {
          text-decoration: line-through;
          color: #888;
          font-size: 11px;
          margin-right: 6px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #777;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; text-align: right;">
        <button onclick="window.print()" style="background: #8e0000; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">🖨️ Print / Save as PDF</button>
      </div>

      <div class="header">
        <div class="brand-name">✨ Kalishwary Crackers ✨</div>
        <div class="sub-title">Direct Sivakasi Wholesale & Retail Fireworks Supplier</div>
        <div class="sub-title">Main Road, Sivakasi, Tamil Nadu | Helpline: +91-9876543210</div>
      </div>

      <div class="meta-bar">
        <span>📅 Price List Date: <strong>${dateStr}</strong></span>
        <span>🏷️ Discount: <strong>Up to 80% OFF Factory Rates</strong></span>
        <span>🚚 Delivery: <strong>Pan-India Express Transport</strong></span>
      </div>
  `;

  Object.keys(categorized).forEach(category => {
    htmlContent += `<div class="cat-title">${category.toUpperCase()}</div>`;
    htmlContent += `
      <table>
        <thead>
          <tr>
            <th style="width: 10%;">#</th>
            <th style="width: 50%;">Product Name</th>
            <th style="width: 20%;">Stock Status</th>
            <th style="width: 20%; text-align: right;">Wholesale Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    categorized[category].forEach((item, idx) => {
      htmlContent += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.name}</strong></td>
          <td>${item.stock || 'In Stock'}</td>
          <td style="text-align: right;">
            ${item.regularPrice ? `<span class="strike">₹${item.regularPrice}</span>` : ''}
            <span class="price">₹${item.price}</span>
          </td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
    `;
  });

  htmlContent += `
      <div class="footer">
        <p><strong>Note:</strong> Minimum Wholesale Order Value is <strong>₹2,500</strong>. Prices are subject to availability.</p>
        <p>Order Online at <strong>kalishwaricrackers.com</strong> or WhatsApp <strong>+91-9876543210</strong></p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
