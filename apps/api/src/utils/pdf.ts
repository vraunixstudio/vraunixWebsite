import PDFDocument from 'pdfkit';
import { money } from '@vraunix/shared';

export function generateProposalPDF(proposal: any, client: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  
  doc.fontSize(20).text('PROPOSAL', { align: 'right' });
  doc.fontSize(12).text(proposal.number, { align: 'right' });
  doc.moveDown();
  
  doc.fontSize(16).text(proposal.title);
  doc.moveDown();
  
  doc.fontSize(10).text('Client:');
  doc.fontSize(12).text(client?.name || '');
  if (client?.email) doc.text(client.email);
  if (client?.phone) doc.text(client.phone);
  doc.moveDown();
  
  doc.fontSize(10).text('Status: ' + proposal.status);
  doc.text('Created: ' + new Date(proposal.createdAt).toLocaleDateString());
  if (proposal.sentAt) doc.text('Sent: ' + new Date(proposal.sentAt).toLocaleDateString());
  if (proposal.acceptedAt) doc.text('Accepted: ' + new Date(proposal.acceptedAt).toLocaleDateString());
  doc.moveDown();
  
  if (proposal.description) {
    doc.fontSize(12).text('Description');
    doc.fontSize(10).text(proposal.description);
    doc.moveDown();
  }
  
  if (proposal.scope && proposal.scope.length > 0) {
    doc.fontSize(12).text('Scope & Deliverables');
    proposal.scope.forEach((item: string) => {
      doc.fontSize(10).text('• ' + item);
    });
    doc.moveDown();
  }
  
  doc.fontSize(12).text('Total');
  doc.fontSize(14).text(money(proposal.pricing?.totalMinor || 0, proposal.pricing?.currency || 'NPR'));
  
  doc.end();
  return doc;
}

export function generateInvoicePDF(invoice: any, client: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  
  doc.fontSize(20).text('INVOICE', { align: 'right' });
  doc.fontSize(12).text(invoice.number, { align: 'right' });
  doc.moveDown();
  
  doc.fontSize(10).text('Bill To:');
  doc.fontSize(12).text(client?.name || '');
  if (client?.email) doc.text(client.email);
  if (client?.phone) doc.text(client.phone);
  doc.moveDown();
  
  doc.fontSize(10).text('Issue Date: ' + new Date(invoice.issueDate).toLocaleDateString());
  doc.text('Due Date: ' + new Date(invoice.dueDate).toLocaleDateString());
  doc.text('Status: ' + invoice.status);
  doc.moveDown();
  
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    doc.fontSize(12).text('Items');
    doc.moveDown(0.5);
    invoice.lineItems.forEach((item: any) => {
      doc.fontSize(10).text(item.description + ' - Qty: ' + item.quantity + ' - ' + money(item.amountMinor, invoice.currency));
    });
    doc.moveDown();
  }
  
  doc.fontSize(10).text('Subtotal: ' + money(invoice.subtotalMinor, invoice.currency));
  if (invoice.discountMinor > 0) doc.text('Discount: -' + money(invoice.discountMinor, invoice.currency));
  doc.text('Tax: ' + money(invoice.taxMinor, invoice.currency));
  doc.moveDown(0.5);
  doc.fontSize(12).text('Total: ' + money(invoice.totalMinor, invoice.currency));
  doc.fontSize(10).text('Paid: ' + money(invoice.amountPaidMinor || 0, invoice.currency));
  doc.text('Balance: ' + money(invoice.balanceMinor, invoice.currency));
  
  doc.end();
  return doc;
}
