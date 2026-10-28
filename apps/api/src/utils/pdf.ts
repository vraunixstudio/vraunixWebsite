import PDFDocument from 'pdfkit';
import { money } from '@vraunix/shared';

// Minimal Black & White Design System
const BW = {
  black: '#000000',
  dark: '#171717',
  grayDark: '#404040',
  grayMid: '#737373',
  grayLight: '#A3A3A3',
  border: '#E5E5E5',
  borderDark: '#000000',
  white: '#FFFFFF',
};

function drawFooters(doc: PDFKit.PDFDocument, footerNote?: string) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.save();
    doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, 790).lineTo(551, 790).stroke();
    doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid)
       .text(footerNote || 'Vraunix Studio  ·  Confidential & Proprietary', 44, 796, { width: 340, lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.dark)
       .text(`Page ${i + 1} of ${range.count}`, 420, 796, { width: 131, align: 'right', lineBreak: false });
    doc.restore();
  }
}

export function generateProposalPDF(proposal: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const company = settings?.company || {
    name: 'VRAUNIX STUDIO',
    slogan: 'Web Development & Digital Solutions',
    email: 'hello@vraunix.com',
    phone: '+977-9800000000',
    website: 'vraunix.com',
    location: 'Kathmandu, Nepal'
  };

  // Header Left: Minimal Text Logo only (No graphic icon)
  doc.font('Helvetica-Bold').fontSize(16).fillColor(BW.black)
     .text((company.name || 'VRAUNIX STUDIO').toUpperCase(), 44, 44, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
     .text(company.slogan || 'Web Development & Digital Solutions', 44, 63, { lineBreak: false });
  
  const studioContact = [company.email, company.phone, company.website].filter(Boolean).join('  ·  ');
  doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid)
     .text(studioContact, 44, 75, { lineBreak: false });

  // Header Right: Document Title & Fact Details
  doc.font('Helvetica-Bold').fontSize(20).fillColor(BW.black)
     .text('PROPOSAL', 350, 42, { width: 201, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(BW.dark)
     .text(proposal.number || 'PROP-DRAFT', 350, 65, { width: 201, align: 'right' });
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
     .text(`STATUS: ${(proposal.status || 'draft').toUpperCase()}`, 350, 78, { width: 201, align: 'right' });

  // Dividing Rule
  doc.strokeColor(BW.black).lineWidth(1).moveTo(44, 94).lineTo(551, 94).stroke();

  // Meta Section: Client (Left) & Dates (Right)
  const metaY = 106;
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('PREPARED FOR', 44, metaY);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(BW.black).text(client?.name || 'Valued Client', 44, metaY + 12);
  
  const clientDetails = [client?.email, client?.phone, client?.address].filter(Boolean).join('  ·  ');
  if (clientDetails) {
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark).text(clientDetails, 44, metaY + 25);
  }

  const createdDate = new Date(proposal.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const validUntilDays = settings?.proposal?.validityDays || 30;
  const validDate = new Date(new Date(proposal.createdAt || Date.now()).getTime() + validUntilDays * 86400000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('DATE:', 380, metaY);
  doc.font('Helvetica').fontSize(8.5).fillColor(BW.black).text(createdDate, 440, metaY);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('VALID UNTIL:', 380, metaY + 14);
  doc.font('Helvetica').fontSize(8.5).fillColor(BW.black).text(validDate, 440, metaY + 14);

  let curY = metaY + 44;
  doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 14;

  // Project Title
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('PROJECT SPECIFICATION', 44, curY);
  curY += 11;
  doc.font('Helvetica-Bold').fontSize(12).fillColor(BW.black).text(proposal.title || 'Untitled Proposal', 44, curY);
  curY += 22;

  // Section 1: Overview & About
  if (proposal.description) {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black).text('01.  PROJECT OVERVIEW', 44, curY);
    curY += 12;
    doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
    curY += 8;

    doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark);
    const descHeight = doc.heightOfString(proposal.description, { width: 507, lineGap: 3.5 });
    doc.text(proposal.description, 44, curY, { width: 507, lineGap: 3.5 });
    curY += descHeight + 16;
  }

  // Section 2: Scope of Deliverables
  if (proposal.scope && proposal.scope.length > 0) {
    if (curY + 100 > 740) {
      doc.addPage();
      curY = 50;
    }

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black).text('02.  SCOPE OF WORK & DELIVERABLES', 44, curY);
    curY += 12;
    doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
    curY += 10;

    proposal.scope.forEach((item: string) => {
      if (curY + 22 > 750) {
        doc.addPage();
        curY = 50;
      }
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BW.black).text('—', 44, curY);
      doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark).text(item, 58, curY, { width: 493, lineGap: 2 });
      const itemHeight = Math.max(16, doc.heightOfString(item, { width: 493, lineGap: 2 }) + 4);
      curY += itemHeight;
    });

    curY += 14;
  }

  // Section 3: Commercial Valuation
  if (curY + 100 > 740) {
    doc.addPage();
    curY = 50;
  }

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black).text('03.  COMMERCIAL VALUATION', 44, curY);
  curY += 12;
  doc.strokeColor(BW.black).lineWidth(0.75).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 6;

  // If itemized lines exist
  if (proposal.pricing?.lines && proposal.pricing.lines.length > 0) {
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.black);
    doc.text('DESCRIPTION', 44, curY);
    doc.text('QTY', 340, curY, { width: 40, align: 'center' });
    doc.text('RATE', 390, curY, { width: 75, align: 'right' });
    doc.text('AMOUNT', 475, curY, { width: 75, align: 'right' });
    curY += 14;
    doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
    curY += 6;

    proposal.pricing.lines.forEach((line: any) => {
      if (curY + 20 > 750) {
        doc.addPage();
        curY = 50;
      }
      doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark)
         .text(line.description, 44, curY, { width: 280, lineBreak: false });
      doc.text(line.quantity || '1', 340, curY, { width: 40, align: 'center' });
      doc.text(money(line.unitPriceMinor || 0, proposal.pricing.currency), 390, curY, { width: 75, align: 'right' });
      const lineTotal = (line.unitPriceMinor || 0) * Number(line.quantity || 1);
      doc.font('Helvetica-Bold').text(money(lineTotal, proposal.pricing.currency), 475, curY, { width: 75, align: 'right' });
      curY += 18;
    });

    doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
    curY += 8;
  }

  // Total line
  doc.strokeColor(BW.black).lineWidth(1).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 8;
  doc.font('Helvetica-Bold').fontSize(9).fillColor(BW.black).text('TOTAL VALUATION:', 44, curY);
  const totalStr = money(proposal.pricing?.totalMinor || 0, proposal.pricing?.currency || 'NPR');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(BW.black).text(totalStr, 350, curY - 2, { width: 201, align: 'right' });
  curY += 22;
  doc.strokeColor(BW.black).lineWidth(1).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 18;

  // Section 4: Terms & Signatures
  if (curY + 120 > 740) {
    doc.addPage();
    curY = 50;
  }

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black).text('04.  AUTHORIZATION & ACCEPTANCE', 44, curY);
  curY += 12;
  doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 8;

  const terms = settings?.proposal?.defaultTerms || 'By signing below, the parties agree to the project deliverables, timeline, and commercial valuation specified in this proposal.';
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark).text(terms, 44, curY, { width: 507, lineGap: 2 });
  curY += doc.heightOfString(terms, { width: 507, lineGap: 2 }) + 22;

  // Minimal Signatures
  const sigWidth = 220;
  doc.strokeColor(BW.black).lineWidth(0.75).moveTo(44, curY + 30).lineTo(44 + sigWidth, curY + 30).stroke();
  doc.font('Helvetica-Bold').fontSize(8).fillColor(BW.black).text('CLIENT ACCEPTANCE', 44, curY + 36);
  doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid).text('Authorized Signature & Date', 44, curY + 47);

  doc.strokeColor(BW.black).lineWidth(0.75).moveTo(330, curY + 30).lineTo(330 + sigWidth, curY + 30).stroke();
  doc.font('Helvetica-Bold').fontSize(8).fillColor(BW.black).text('VRAUNIX STUDIO', 330, curY + 36);
  doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid).text('Authorized Signatory & Date', 330, curY + 47);

  drawFooters(doc, settings?.branding?.documentFooter);
  doc.end();
  return doc;
}

export function generateInvoicePDF(invoice: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const company = settings?.company || {
    name: 'VRAUNIX STUDIO',
    slogan: 'Web Development & Digital Solutions',
    email: 'hello@vraunix.com',
    phone: '+977-9800000000',
    website: 'vraunix.com',
    location: 'Kathmandu, Nepal'
  };

  // Header Left: Minimal Text Logo only (No graphic icon)
  doc.font('Helvetica-Bold').fontSize(16).fillColor(BW.black)
     .text((company.name || 'VRAUNIX STUDIO').toUpperCase(), 44, 44, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
     .text(company.slogan || 'Web Development & Digital Solutions', 44, 63, { lineBreak: false });
  
  const studioContact = [company.email, company.phone, company.website].filter(Boolean).join('  ·  ');
  doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid)
     .text(studioContact, 44, 75, { lineBreak: false });

  // Header Right: Document Title & Fact Details
  doc.font('Helvetica-Bold').fontSize(20).fillColor(BW.black)
     .text('INVOICE', 350, 42, { width: 201, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(BW.dark)
     .text(invoice.number || 'INV-DRAFT', 350, 65, { width: 201, align: 'right' });
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
     .text(`STATUS: ${(invoice.status || 'draft').toUpperCase().replace('_', ' ')}`, 350, 78, { width: 201, align: 'right' });

  // Dividing Rule
  doc.strokeColor(BW.black).lineWidth(1).moveTo(44, 94).lineTo(551, 94).stroke();

  // Meta Section: Billed To (Left) & Invoice Dates (Right)
  const metaY = 106;
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('BILLED TO', 44, metaY);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(BW.black).text(client?.name || 'Valued Client', 44, metaY + 12);
  
  const clientDetails = [client?.email, client?.phone, client?.address].filter(Boolean).join('  ·  ');
  if (clientDetails) {
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark).text(clientDetails, 44, metaY + 25);
  }

  const issueDate = new Date(invoice.issueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const dueDate = new Date(invoice.dueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('INVOICE DATE:', 380, metaY);
  doc.font('Helvetica').fontSize(8.5).fillColor(BW.black).text(issueDate, 460, metaY);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid).text('PAYMENT DUE:', 380, metaY + 14);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black).text(dueDate, 460, metaY + 14);

  let curY = metaY + 44;
  doc.strokeColor(BW.black).lineWidth(1).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 8;

  // Line Items Table Header
  doc.font('Helvetica-Bold').fontSize(8).fillColor(BW.black);
  doc.text('DESCRIPTION', 44, curY);
  doc.text('QTY', 320, curY, { width: 45, align: 'center' });
  doc.text('RATE', 380, curY, { width: 75, align: 'right' });
  doc.text('AMOUNT', 475, curY, { width: 75, align: 'right' });
  curY += 14;
  doc.strokeColor(BW.black).lineWidth(0.75).moveTo(44, curY).lineTo(551, curY).stroke();
  curY += 8;

  if (invoice.lineItems && invoice.lineItems.length > 0) {
    invoice.lineItems.forEach((item: any) => {
      const descWidth = 260;
      doc.font('Helvetica').fontSize(8.5);
      const textH = doc.heightOfString(item.description, { width: descWidth, lineGap: 2 });
      const rowHeight = Math.max(20, textH + 8);

      if (curY + rowHeight > 740) {
        doc.addPage();
        curY = 50;
      }

      doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark)
         .text(item.description, 44, curY, { width: descWidth, lineGap: 2 });
      doc.text(String(item.quantity || 1), 320, curY, { width: 45, align: 'center' });
      doc.text(money(item.unitPriceMinor || 0, invoice.currency), 380, curY, { width: 75, align: 'right' });
      doc.font('Helvetica-Bold').text(money(item.amountMinor || 0, invoice.currency), 475, curY, { width: 75, align: 'right' });

      curY += rowHeight;
      doc.strokeColor(BW.border).lineWidth(0.5).moveTo(44, curY).lineTo(551, curY).stroke();
      curY += 6;
    });
  }

  curY += 12;

  // Bottom Section: Notes on Left, Totals on Right
  if (curY + 140 > 750) {
    doc.addPage();
    curY = 50;
  }

  const totalsY = curY;
  const leftWidth = 270;
  const rightWidth = 220;
  const rightX = 331;

  // Left Column: Payment Instructions
  doc.font('Helvetica-Bold').fontSize(8).fillColor(BW.black).text('PAYMENT INSTRUCTIONS & NOTES', 44, totalsY);
  const paymentNotes = invoice.notes || settings?.invoice?.paymentTerms || 'Payment is due by the date shown above. Please include the invoice number with your payment.';
  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark).text(paymentNotes, 44, totalsY + 14, { width: leftWidth, lineGap: 3 });

  // Right Column: Totals
  let rowY = totalsY;
  const rowH = 16;

  doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark).text('Subtotal:', rightX, rowY);
  doc.font('Helvetica-Bold').fillColor(BW.black).text(money(invoice.subtotalMinor || 0, invoice.currency), rightX + 80, rowY, { width: rightWidth - 80, align: 'right' });
  rowY += rowH;

  if (invoice.discountMinor && invoice.discountMinor > 0) {
    doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark).text('Discount:', rightX, rowY);
    doc.font('Helvetica-Bold').fillColor(BW.black).text('-' + money(invoice.discountMinor, invoice.currency), rightX + 80, rowY, { width: rightWidth - 80, align: 'right' });
    rowY += rowH;
  }

  if (invoice.taxMinor && invoice.taxMinor > 0) {
    const taxLabel = `Tax (${invoice.taxRatePercent || 0}%):`;
    doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark).text(taxLabel, rightX, rowY);
    doc.font('Helvetica-Bold').fillColor(BW.black).text(money(invoice.taxMinor, invoice.currency), rightX + 80, rowY, { width: rightWidth - 80, align: 'right' });
    rowY += rowH;
  }

  doc.strokeColor(BW.black).lineWidth(0.75).moveTo(rightX, rowY + 2).lineTo(rightX + rightWidth, rowY + 2).stroke();
  rowY += 8;

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(BW.black).text('TOTAL:', rightX, rowY);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(BW.black).text(money(invoice.totalMinor || 0, invoice.currency), rightX + 70, rowY - 1, { width: rightWidth - 70, align: 'right' });
  rowY += rowH + 4;

  doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark).text('Amount Paid:', rightX, rowY);
  doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark).text(money(invoice.amountPaidMinor || 0, invoice.currency), rightX + 80, rowY, { width: rightWidth - 80, align: 'right' });
  rowY += rowH;

  doc.strokeColor(BW.black).lineWidth(1).moveTo(rightX, rowY + 2).lineTo(rightX + rightWidth, rowY + 2).stroke();
  rowY += 8;

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(BW.black).text('BALANCE DUE:', rightX, rowY);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(BW.black).text(money(invoice.balanceMinor || 0, invoice.currency), rightX + 70, rowY - 1, { width: rightWidth - 70, align: 'right' });

  drawFooters(doc, settings?.branding?.documentFooter);
  doc.end();
  return doc;
}
