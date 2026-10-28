import PDFDocument from 'pdfkit';
import { money } from '@vraunix/shared';

export function generateProposalPDF(proposal: any, client: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const pageWidth = doc.page.width - 100;
  
  // Header
  doc.font('Helvetica-Bold').fontSize(24).text('VRAUNIX STUDIO', 50, 50);
  doc.font('Helvetica').fontSize(9).text('Web Development & Design Studio', 50, 78);
  
  doc.font('Helvetica-Bold').fontSize(18).text('PROPOSAL', 50, 50, { align: 'right' });
  doc.font('Helvetica').fontSize(10).text(proposal.number, 50, 72, { align: 'right' });
  
  doc.moveTo(50, 95).lineTo(545, 95).stroke();
  doc.moveDown(2);
  
  // Client Info
  doc.font('Helvetica-Bold').fontSize(10).text('TO:', 50, 110);
  doc.font('Helvetica-Bold').fontSize(11).text(client?.name || '', 50, 125);
  if (client?.email) { doc.font('Helvetica').fontSize(9).text(client.email, 50, 140); }
  if (client?.phone) { doc.font('Helvetica').fontSize(9).text(client.phone, 50, 152); }
  
  // Dates
  doc.font('Helvetica-Bold').fontSize(10).text('DATE:', 350, 110);
  doc.font('Helvetica').fontSize(9).text(new Date(proposal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 350, 125);
  doc.font('Helvetica-Bold').fontSize(10).text('STATUS:', 350, 140);
  doc.font('Helvetica').fontSize(9).text(proposal.status.toUpperCase(), 350, 155);
  
  doc.moveTo(50, 175).lineTo(545, 175).stroke();
  
  // Title
  doc.font('Helvetica-Bold').fontSize(16).text(proposal.title, 50, 190);
  doc.moveDown(2);
  
  // Description
  if (proposal.description) {
    doc.font('Helvetica-Bold').fontSize(11).text('PROJECT DESCRIPTION', 50, doc.y);
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(9).text(proposal.description, 50, doc.y, { width: pageWidth, align: 'justify' });
    doc.moveDown(1.5);
  }
  
  // Scope
  if (proposal.scope && proposal.scope.length > 0) {
    doc.font('Helvetica-Bold').fontSize(11).text('SCOPE OF WORK', 50, doc.y);
    doc.moveDown(0.5);
    proposal.scope.forEach((item: string) => {
      doc.font('Helvetica').fontSize(9).text('• ' + item, 55, doc.y, { width: pageWidth - 5 });
      doc.moveDown(0.3);
    });
    doc.moveDown(1);
  }
  
  // Total
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).text('TOTAL:', 400, doc.y);
  doc.font('Helvetica-Bold').fontSize(14).text(money(proposal.pricing?.totalMinor || 0, proposal.pricing?.currency || 'NPR'), 450, doc.y, { align: 'right', width: 95 });
  
  // Footer
  doc.font('Helvetica').fontSize(8).text('Thank you for considering Vraunix Studio.', 50, 750, { align: 'center', width: pageWidth });
  
  doc.end();
  return doc;
}

export function generateInvoicePDF(invoice: any, client: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const pageWidth = doc.page.width - 100;
  
  // Header
  doc.font('Helvetica-Bold').fontSize(24).text('VRAUNIX STUDIO', 50, 50);
  doc.font('Helvetica').fontSize(9).text('Web Development & Design Studio', 50, 78);
  
  doc.font('Helvetica-Bold').fontSize(18).text('INVOICE', 50, 50, { align: 'right' });
  doc.font('Helvetica').fontSize(10).text(invoice.number, 50, 72, { align: 'right' });
  
  doc.moveTo(50, 95).lineTo(545, 95).stroke();
  
  // Bill To
  doc.font('Helvetica-Bold').fontSize(10).text('BILL TO:', 50, 110);
  doc.font('Helvetica-Bold').fontSize(11).text(client?.name || '', 50, 125);
  if (client?.email) { doc.font('Helvetica').fontSize(9).text(client.email, 50, 140); }
  if (client?.phone) { doc.font('Helvetica').fontSize(9).text(client.phone, 50, 152); }
  
  // Invoice Details
  doc.font('Helvetica-Bold').fontSize(10).text('INVOICE DATE:', 350, 110);
  doc.font('Helvetica').fontSize(9).text(new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 350, 125);
  doc.font('Helvetica-Bold').fontSize(10).text('DUE DATE:', 350, 140);
  doc.font('Helvetica').fontSize(9).text(new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 350, 155);
  
  doc.moveTo(50, 175).lineTo(545, 175).stroke();
  
  // Line Items Table
  let y = 190;
  doc.font('Helvetica-Bold').fontSize(9).text('DESCRIPTION', 50, y);
  doc.text('QTY', 350, y);
  doc.text('RATE', 400, y, { width: 60, align: 'right' });
  doc.text('AMOUNT', 470, y, { width: 75, align: 'right' });
  
  doc.moveTo(50, y + 15).lineTo(545, y + 15).stroke();
  y += 25;
  
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    invoice.lineItems.forEach((item: any) => {
      doc.font('Helvetica').fontSize(9).text(item.description, 50, y, { width: 290 });
      doc.text(item.quantity, 350, y);
      doc.text(money(item.unitPriceMinor, invoice.currency), 400, y, { width: 60, align: 'right' });
      doc.text(money(item.amountMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
      y += 20;
    });
  }
  
  doc.moveTo(50, y + 5).lineTo(545, y + 5).stroke();
  y += 20;
  
  // Totals
  doc.font('Helvetica').fontSize(9).text('Subtotal:', 400, y);
  doc.text(money(invoice.subtotalMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
  y += 15;
  if (invoice.discountMinor > 0) {
    doc.text('Discount:', 400, y);
    doc.text('-' + money(invoice.discountMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
    y += 15;
  }
  doc.text('Tax:', 400, y);
  doc.text(money(invoice.taxMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
  y += 20;
  
  doc.moveTo(400, y).lineTo(545, y).stroke();
  y += 10;
  doc.font('Helvetica-Bold').fontSize(11).text('TOTAL:', 400, y);
  doc.font('Helvetica-Bold').fontSize(12).text(money(invoice.totalMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
  y += 20;
  doc.font('Helvetica').fontSize(9).text('Amount Paid:', 400, y);
  doc.text(money(invoice.amountPaidMinor || 0, invoice.currency), 470, y, { width: 75, align: 'right' });
  y += 15;
  doc.font('Helvetica-Bold').fontSize(10).text('Balance Due:', 400, y);
  doc.font('Helvetica-Bold').fontSize(11).text(money(invoice.balanceMinor, invoice.currency), 470, y, { width: 75, align: 'right' });
  
  // Footer
  doc.font('Helvetica').fontSize(8).text('Payment due upon receipt. Thank you for your business.', 50, 750, { align: 'center', width: pageWidth });
  
  doc.end();
  return doc;
}

