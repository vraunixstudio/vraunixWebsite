import PDFDocument from 'pdfkit';
import { money } from '@vraunix/shared';

const COLOR = {
  primary: '#0F172A',     // Slate 900
  secondary: '#1E293B',   // Slate 800
  accent: '#2563EB',      // Blue 600
  accentLight: '#EFF6FF', // Blue 50
  textMain: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',
  bgLight: '#F8FAFC',
  bgCard: '#F1F5F9',
  white: '#FFFFFF',
};

function drawLogo(doc: PDFKit.PDFDocument, x: number, y: number) {
  doc.save();
  // Outer rounded square
  doc.roundedRect(x, y, 36, 36, 8).fill(COLOR.primary);
  
  // Clean white geometric "V" inside
  doc.fillColor(COLOR.white).font('Helvetica-Bold').fontSize(20);
  doc.text('V', x, y + 7, { width: 36, align: 'center', lineBreak: false });
  doc.restore();
}

function drawStatusPill(doc: PDFKit.PDFDocument, text: string, x: number, y: number, alignRight = true) {
  const upper = (text || 'DRAFT').toUpperCase();
  const themes: Record<string, { bg: string; text: string; border: string }> = {
    ACCEPTED: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
    PAID: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
    ISSUED: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
    SENT: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
    DRAFT: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
    PARTIALLY_PAID: { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' },
    OVERDUE: { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' },
    DECLINED: { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' },
    EXPIRED: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
    VOID: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
  };

  const theme = themes[upper] || { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
  doc.font('Helvetica-Bold').fontSize(7.5);
  const textWidth = doc.widthOfString(upper);
  const pillWidth = Math.max(50, textWidth + 16);
  const pillHeight = 17;
  const pillX = alignRight ? x - pillWidth : x;

  doc.save();
  doc.roundedRect(pillX, y, pillWidth, pillHeight, 8.5)
     .fillAndStroke(theme.bg, theme.border);
  doc.fillColor(theme.text)
     .text(upper, pillX, y + 4.5, { width: pillWidth, align: 'center', lineBreak: false });
  doc.restore();
}

function drawSectionHeader(doc: PDFKit.PDFDocument, badgeText: string, titleText: string, y: number): number {
  doc.save();
  // Small colored index badge
  doc.roundedRect(44, y, 18, 14, 3).fill(COLOR.accentLight);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.accent)
     .text(badgeText, 44, y + 2.5, { width: 18, align: 'center', lineBreak: false });

  // Section title
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLOR.textMain)
     .text(titleText.toUpperCase(), 68, y + 2.5, { lineBreak: false });

  // Thin dividing line
  doc.strokeColor(COLOR.border).lineWidth(0.75)
     .moveTo(44, y + 19).lineTo(551, y + 19).stroke();
  doc.restore();
  return y + 27;
}

function drawFooters(doc: PDFKit.PDFDocument, footerNote?: string) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.save();
    doc.strokeColor(COLOR.border).lineWidth(0.75).moveTo(44, 788).lineTo(551, 788).stroke();
    doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textLight)
       .text(footerNote || 'Vraunix Studio · High-Performance Web Architecture & Digital Solutions', 44, 795, { width: 340, lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted)
       .text(`Page ${i + 1} of ${range.count}`, 420, 795, { width: 131, align: 'right', lineBreak: false });
    doc.restore();
  }
}

export function generateProposalPDF(proposal: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const company = settings?.company || {
    name: 'Vraunix Studio',
    slogan: 'Web Development & Digital Solutions',
    email: 'hello@vraunix.com',
    phone: '+977-9800000000',
    website: 'vraunix.com',
    location: 'Kathmandu, Nepal'
  };

  // Header Left: Brand Logo & Info
  drawLogo(doc, 44, 44);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(COLOR.primary)
     .text((company.name || 'VRAUNIX STUDIO').toUpperCase(), 88, 45, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(COLOR.textMuted)
     .text(company.slogan || 'Web Development & Digital Solutions', 88, 60, { lineBreak: false });
  
  const studioContact = [company.email, company.phone, company.website].filter(Boolean).join('  ·  ');
  doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textLight)
     .text(studioContact, 88, 72, { lineBreak: false });

  // Header Right: Document Title & Meta
  doc.font('Helvetica-Bold').fontSize(20).fillColor(COLOR.primary)
     .text('PROPOSAL', 350, 42, { width: 201, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent)
     .text(proposal.number || 'PROP-DRAFT', 350, 66, { width: 201, align: 'right' });

  // Status Pill
  drawStatusPill(doc, proposal.status || 'draft', 551, 80, true);

  // Divider Bar
  doc.save();
  doc.strokeColor(COLOR.border).lineWidth(1).moveTo(44, 102).lineTo(551, 102).stroke();
  doc.strokeColor(COLOR.accent).lineWidth(2).moveTo(44, 102).lineTo(94, 102).stroke();
  doc.restore();

  // Meta Cards: Prepared For (Client) & Proposal Meta
  const cardY = 112;
  const cardHeight = 68;

  // Left Card: Client
  doc.save();
  doc.roundedRect(44, cardY, 310, cardHeight, 6).fillAndStroke(COLOR.bgLight, COLOR.border);
  doc.roundedRect(44, cardY, 3.5, cardHeight, 1.5).fill(COLOR.accent);
  
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted)
     .text('PREPARED FOR', 56, cardY + 10, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR.textMain)
     .text(client?.name || 'Valued Client', 56, cardY + 22, { width: 290, lineBreak: false });
  
  const clientMeta = [client?.email, client?.phone, client?.address].filter(Boolean).join('  ·  ');
  if (clientMeta) {
    doc.font('Helvetica').fontSize(8).fillColor(COLOR.textSecondary)
       .text(clientMeta, 56, cardY + 38, { width: 290, lineBreak: false });
  }
  doc.restore();

  // Right Card: Dates
  doc.save();
  doc.roundedRect(364, cardY, 187, cardHeight, 6).fillAndStroke(COLOR.bgLight, COLOR.border);
  
  const createdDate = new Date(proposal.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const validUntilDays = settings?.proposal?.validityDays || 30;
  const validDate = new Date(new Date(proposal.createdAt || Date.now()).getTime() + validUntilDays * 86400000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text('ISSUED DATE', 376, cardY + 10);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR.textMain).text(createdDate, 376, cardY + 21);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text('VALID UNTIL', 376, cardY + 37);
  doc.font('Helvetica').fontSize(9).fillColor(COLOR.textSecondary).text(validDate, 376, cardY + 48);
  doc.restore();

  let curY = cardY + cardHeight + 16;

  // Title Banner
  doc.save();
  doc.roundedRect(44, curY, 507, 34, 5).fill(COLOR.accentLight);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.accent).text('PROJECT SPECIFICATION', 56, curY + 6);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLOR.primary).text(proposal.title || 'Untitled Project Proposal', 56, curY + 17, { width: 485, lineBreak: false });
  doc.restore();

  curY += 46;

  // Section 1: Overview & About
  if (proposal.description) {
    curY = drawSectionHeader(doc, '01', 'Project Overview & Objectives', curY);
    
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textSecondary);
    const descHeight = doc.heightOfString(proposal.description, { width: 507, lineGap: 3 });
    doc.text(proposal.description, 44, curY, { width: 507, lineGap: 3 });
    curY += descHeight + 16;
  }

  // Section 2: Scope of Deliverables
  if (proposal.scope && proposal.scope.length > 0) {
    if (curY + 120 > 740) {
      doc.addPage();
      curY = 50;
    }

    curY = drawSectionHeader(doc, '02', 'Scope of Work & Deliverables', curY);

    proposal.scope.forEach((item: string) => {
      if (curY + 28 > 750) {
        doc.addPage();
        curY = 50;
      }

      doc.save();
      // Bullet icon box
      doc.roundedRect(44, curY + 1, 14, 14, 3).fill(COLOR.bgCard);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(COLOR.accent)
         .text('✓', 44, curY + 3, { width: 14, align: 'center', lineBreak: false });

      doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textMain)
         .text(item, 66, curY + 2.5, { width: 485, lineGap: 2 });
      
      const itemHeight = Math.max(18, doc.heightOfString(item, { width: 485, lineGap: 2 }) + 6);
      
      // Separator dot line
      doc.strokeColor(COLOR.borderLight).lineWidth(0.5)
         .moveTo(66, curY + itemHeight - 2).lineTo(551, curY + itemHeight - 2).stroke();
      doc.restore();

      curY += itemHeight;
    });

    curY += 12;
  }

  // Section 3: Commercial Valuation
  if (curY + 110 > 740) {
    doc.addPage();
    curY = 50;
  }

  curY = drawSectionHeader(doc, '03', 'Investment & Valuation', curY);

  // If itemized lines exist
  if (proposal.pricing?.lines && proposal.pricing.lines.length > 0) {
    // Table header
    doc.save();
    doc.rect(44, curY, 507, 20).fill(COLOR.bgCard);
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted);
    doc.text('DELIVERABLE DESCRIPTION', 54, curY + 6);
    doc.text('QTY', 330, curY + 6, { width: 40, align: 'center' });
    doc.text('RATE', 380, curY + 6, { width: 75, align: 'right' });
    doc.text('AMOUNT', 465, curY + 6, { width: 75, align: 'right' });
    doc.restore();
    curY += 20;

    proposal.pricing.lines.forEach((line: any, idx: number) => {
      if (curY + 24 > 750) {
        doc.addPage();
        curY = 50;
      }
      const bg = idx % 2 === 1 ? COLOR.bgLight : COLOR.white;
      doc.save();
      doc.rect(44, curY, 507, 20).fill(bg);
      doc.font('Helvetica').fontSize(8).fillColor(COLOR.textMain)
         .text(line.description, 54, curY + 5, { width: 270, lineBreak: false });
      doc.text(line.quantity || '1', 330, curY + 5, { width: 40, align: 'center' });
      doc.text(money(line.unitPriceMinor || 0, proposal.pricing.currency), 380, curY + 5, { width: 75, align: 'right' });
      const lineTotal = (line.unitPriceMinor || 0) * Number(line.quantity || 1);
      doc.font('Helvetica-Bold').text(money(lineTotal, proposal.pricing.currency), 465, curY + 5, { width: 75, align: 'right' });
      doc.strokeColor(COLOR.border).lineWidth(0.5).moveTo(44, curY + 20).lineTo(551, curY + 20).stroke();
      doc.restore();
      curY += 20;
    });
    curY += 8;
  }

  // Total Box
  doc.save();
  doc.roundedRect(44, curY, 507, 40, 6).fill(COLOR.primary);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#94A3B8')
     .text('TOTAL ESTIMATED PROJECT VALUATION', 60, curY + 14);
  const totalStr = money(proposal.pricing?.totalMinor || 0, proposal.pricing?.currency || 'NPR');
  doc.font('Helvetica-Bold').fontSize(15).fillColor(COLOR.white)
     .text(totalStr, 300, curY + 11, { width: 235, align: 'right' });
  doc.restore();

  curY += 54;

  // Section 4: Terms & Signatures
  if (curY + 130 > 740) {
    doc.addPage();
    curY = 50;
  }

  curY = drawSectionHeader(doc, '04', 'Authorization & Formal Acceptance', curY);

  const defaultTerms = settings?.proposal?.defaultTerms || 'By signing below, the parties agree to the project deliverables, timeline, and commercial valuation specified in this proposal. Payment terms and milestones will proceed in accordance with subsequent project invoices.';
  doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textMuted)
     .text(defaultTerms, 44, curY, { width: 507, lineGap: 2.5 });
  curY += doc.heightOfString(defaultTerms, { width: 507, lineGap: 2.5 }) + 14;

  // Signature Cards
  const sigY = curY;
  const sigWidth = 246;
  const sigHeight = 76;

  // Left Box: Client Sign-off
  doc.save();
  doc.roundedRect(44, sigY, sigWidth, sigHeight, 5).strokeColor(COLOR.border).lineWidth(0.75).stroke();
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text('FOR CLIENT ACCEPTANCE', 54, sigY + 8);
  doc.strokeColor(COLOR.borderDark).lineWidth(0.75).moveTo(54, sigY + 46).lineTo(54 + sigWidth - 20, sigY + 46).stroke();
  doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textSecondary).text('Authorized Signature & Company Seal', 54, sigY + 52);
  doc.text('Date: _______________', 180, sigY + 52, { width: 100, align: 'right' });
  doc.restore();

  // Right Box: Studio Sign-off
  doc.save();
  doc.roundedRect(305, sigY, sigWidth, sigHeight, 5).strokeColor(COLOR.border).lineWidth(0.75).stroke();
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text(`FOR ${company.name.toUpperCase()}`, 315, sigY + 8);
  doc.strokeColor(COLOR.borderDark).lineWidth(0.75).moveTo(315, sigY + 46).lineTo(315 + sigWidth - 20, sigY + 46).stroke();
  doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textSecondary).text('Authorized Studio Representative', 315, sigY + 52);
  doc.text('Date: _______________', 440, sigY + 52, { width: 100, align: 'right' });
  doc.restore();

  // Footers
  drawFooters(doc, settings?.branding?.documentFooter);
  doc.end();
  return doc;
}

export function generateInvoicePDF(invoice: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const company = settings?.company || {
    name: 'Vraunix Studio',
    slogan: 'Web Development & Digital Solutions',
    email: 'hello@vraunix.com',
    phone: '+977-9800000000',
    website: 'vraunix.com',
    location: 'Kathmandu, Nepal'
  };

  // Header Left: Brand Logo & Info
  drawLogo(doc, 44, 44);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(COLOR.primary)
     .text((company.name || 'VRAUNIX STUDIO').toUpperCase(), 88, 45, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor(COLOR.textMuted)
     .text(company.slogan || 'Web Development & Digital Solutions', 88, 60, { lineBreak: false });
  
  const studioContact = [company.email, company.phone, company.website].filter(Boolean).join('  ·  ');
  doc.font('Helvetica').fontSize(7.5).fillColor(COLOR.textLight)
     .text(studioContact, 88, 72, { lineBreak: false });

  // Header Right: Document Title & Meta
  doc.font('Helvetica-Bold').fontSize(22).fillColor(COLOR.primary)
     .text('INVOICE', 350, 42, { width: 201, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent)
     .text(invoice.number || 'INV-DRAFT', 350, 68, { width: 201, align: 'right' });

  // Status Pill
  drawStatusPill(doc, invoice.status || 'draft', 551, 82, true);

  // Divider Bar
  doc.save();
  doc.strokeColor(COLOR.border).lineWidth(1).moveTo(44, 104).lineTo(551, 104).stroke();
  doc.strokeColor(COLOR.accent).lineWidth(2).moveTo(44, 104).lineTo(94, 104).stroke();
  doc.restore();

  // Meta Cards: Billed To (Client) & Invoice Dates
  const cardY = 114;
  const cardHeight = 68;

  // Left Card: Client
  doc.save();
  doc.roundedRect(44, cardY, 310, cardHeight, 6).fillAndStroke(COLOR.bgLight, COLOR.border);
  doc.roundedRect(44, cardY, 3.5, cardHeight, 1.5).fill(COLOR.accent);
  
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted)
     .text('BILLED TO', 56, cardY + 10, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR.textMain)
     .text(client?.name || 'Valued Client', 56, cardY + 22, { width: 290, lineBreak: false });
  
  const clientMeta = [client?.email, client?.phone, client?.address].filter(Boolean).join('  ·  ');
  if (clientMeta) {
    doc.font('Helvetica').fontSize(8).fillColor(COLOR.textSecondary)
       .text(clientMeta, 56, cardY + 38, { width: 290, lineBreak: false });
  }
  doc.restore();

  // Right Card: Dates
  doc.save();
  doc.roundedRect(364, cardY, 187, cardHeight, 6).fillAndStroke(COLOR.bgLight, COLOR.border);
  
  const issueDate = new Date(invoice.issueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const dueDate = new Date(invoice.dueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text('INVOICE DATE', 376, cardY + 10);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR.textMain).text(issueDate, 376, cardY + 21);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLOR.textMuted).text('PAYMENT DUE DATE', 376, cardY + 37);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(invoice.status === 'overdue' ? '#B91C1C' : COLOR.accent).text(dueDate, 376, cardY + 48);
  doc.restore();

  let curY = cardY + cardHeight + 18;

  // Table of Line Items
  // Header row
  doc.save();
  doc.roundedRect(44, curY, 507, 24, 4).fill(COLOR.primary);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLOR.white);
  doc.text('ITEM & DESCRIPTION', 56, curY + 8);
  doc.text('QTY', 320, curY + 8, { width: 45, align: 'center' });
  doc.text('UNIT RATE', 375, curY + 8, { width: 80, align: 'right' });
  doc.text('AMOUNT', 465, curY + 8, { width: 75, align: 'right' });
  doc.restore();
  curY += 26;

  if (invoice.lineItems && invoice.lineItems.length > 0) {
    invoice.lineItems.forEach((item: any, idx: number) => {
      const descWidth = 250;
      doc.font('Helvetica').fontSize(8.5);
      const textH = doc.heightOfString(item.description, { width: descWidth, lineGap: 2 });
      const rowHeight = Math.max(26, textH + 12);

      if (curY + rowHeight > 740) {
        doc.addPage();
        curY = 50;
      }

      const bg = idx % 2 === 1 ? COLOR.bgLight : COLOR.white;
      doc.save();
      doc.rect(44, curY, 507, rowHeight).fill(bg);
      
      // Description
      doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textMain)
         .text(item.description, 56, curY + 7, { width: descWidth, lineGap: 2 });
      
      // Qty
      doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textSecondary)
         .text(String(item.quantity || 1), 320, curY + 7, { width: 45, align: 'center' });
      
      // Unit Rate
      doc.text(money(item.unitPriceMinor || 0, invoice.currency), 375, curY + 7, { width: 80, align: 'right' });
      
      // Amount
      doc.font('Helvetica-Bold').fillColor(COLOR.textMain)
         .text(money(item.amountMinor || 0, invoice.currency), 465, curY + 7, { width: 75, align: 'right' });
      
      // Bottom border
      doc.strokeColor(COLOR.border).lineWidth(0.5).moveTo(44, curY + rowHeight).lineTo(551, curY + rowHeight).stroke();
      doc.restore();

      curY += rowHeight;
    });
  }

  curY += 16;

  // Bottom Section: Payment Instructions on Left, Totals Card on Right
  if (curY + 160 > 750) {
    doc.addPage();
    curY = 50;
  }

  const totalsY = curY;
  const leftWidth = 270;
  const rightWidth = 225;
  const rightX = 326;

  // Left Column: Payment Instructions & Terms
  doc.save();
  doc.roundedRect(44, totalsY, leftWidth, 140, 6).fillAndStroke(COLOR.bgLight, COLOR.border);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLOR.textMuted)
     .text('PAYMENT INSTRUCTIONS & TERMS', 56, totalsY + 12);
  
  const paymentNotes = invoice.notes || settings?.invoice?.paymentTerms || 'Please transfer payment to the account above before the due date. Include invoice reference in transaction description.';
  doc.font('Helvetica').fontSize(8).fillColor(COLOR.textSecondary)
     .text(paymentNotes, 56, totalsY + 28, { width: leftWidth - 24, lineGap: 3 });

  if (settings?.invoice?.footerNote) {
    doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(COLOR.textLight)
       .text(settings.invoice.footerNote, 56, totalsY + 115, { width: leftWidth - 24 });
  }
  doc.restore();

  // Right Column: Totals Breakdown Card
  doc.save();
  doc.roundedRect(rightX, totalsY, rightWidth, 140, 6).strokeColor(COLOR.border).lineWidth(0.75).stroke();
  
  let rowY = totalsY + 12;
  const rowH = 17;

  // Subtotal
  doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textMuted).text('Subtotal:', rightX + 14, rowY);
  doc.font('Helvetica-Bold').fillColor(COLOR.textMain).text(money(invoice.subtotalMinor || 0, invoice.currency), rightX + 100, rowY, { width: rightWidth - 114, align: 'right' });
  rowY += rowH;

  // Discount (if any)
  if (invoice.discountMinor && invoice.discountMinor > 0) {
    doc.font('Helvetica').fontSize(8.5).fillColor('#B45309').text('Discount:', rightX + 14, rowY);
    doc.font('Helvetica-Bold').fillColor('#B45309').text('-' + money(invoice.discountMinor, invoice.currency), rightX + 100, rowY, { width: rightWidth - 114, align: 'right' });
    rowY += rowH;
  }

  // Tax
  if (invoice.taxMinor && invoice.taxMinor > 0) {
    const taxLabel = `Tax (${invoice.taxRatePercent || 0}%):`;
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textMuted).text(taxLabel, rightX + 14, rowY);
    doc.font('Helvetica-Bold').fillColor(COLOR.textMain).text(money(invoice.taxMinor, invoice.currency), rightX + 100, rowY, { width: rightWidth - 114, align: 'right' });
    rowY += rowH;
  }

  // Dividing line
  doc.strokeColor(COLOR.border).lineWidth(0.75).moveTo(rightX + 14, rowY + 3).lineTo(rightX + rightWidth - 14, rowY + 3).stroke();
  rowY += 10;

  // Total
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.primary).text('TOTAL:', rightX + 14, rowY);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR.primary).text(money(invoice.totalMinor || 0, invoice.currency), rightX + 90, rowY, { width: rightWidth - 104, align: 'right' });
  rowY += rowH + 2;

  // Amount Paid
  doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textMuted).text('Amount Paid:', rightX + 14, rowY);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.textSecondary).text(money(invoice.amountPaidMinor || 0, invoice.currency), rightX + 100, rowY, { width: rightWidth - 114, align: 'right' });
  rowY += rowH + 3;

  // Balance Due Highlight Box
  const isPaid = (invoice.balanceMinor || 0) <= 0;
  const balanceBg = isPaid ? '#DCFCE7' : COLOR.primary;
  const balanceTextCol = isPaid ? '#15803D' : COLOR.white;
  
  doc.roundedRect(rightX + 10, rowY, rightWidth - 20, 26, 4).fill(balanceBg);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(balanceTextCol)
     .text(isPaid ? 'PAID IN FULL' : 'BALANCE DUE:', rightX + 18, rowY + 8);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(balanceTextCol)
     .text(money(invoice.balanceMinor || 0, invoice.currency), rightX + 100, rowY + 7, { width: rightWidth - 126, align: 'right' });
  doc.restore();

  drawFooters(doc, settings?.branding?.documentFooter);
  doc.end();
  return doc;
}
