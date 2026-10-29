import PDFDocument from 'pdfkit';
import { money } from '@vraunix/shared';

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

const PAGE = {
  top: 44,
  bottom: 780,
  width: 595.28,
  contentWidth: 507,
};

const TABLE = {
  descriptionX: 44,
  descriptionWidth: 250,
  quantityX: 294,
  quantityWidth: 42,
  rateX: 336,
  rateWidth: 90,
  amountX: 426,
  amountWidth: 125,
  headerHeight: 22,
};

const BODY_BOTTOM = PAGE.bottom - 28;

type TextBlock = {
  type: 'heading' | 'subheading' | 'paragraph' | 'bullet' | 'numbered' | 'space';
  text: string;
  prefix?: string;
};

function cleanInline(value: unknown): string {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBlock(value: unknown): string {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

function parseTextBlocks(value: unknown): TextBlock[] {
  const lines = String(value ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks: TextBlock[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length === 0) return;
    const text = cleanInline(paragraph.join(' '));
    if (text) blocks.push({ type: 'paragraph', text });
    paragraph = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      blocks.push({ type: 'space', text: '' });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s*(.*)$/);
    if (heading) {
      flush();
      const text = cleanInline(heading[2]);
      if (text) {
        blocks.push({
          type: (heading[1]?.length ?? 1) <= 2 ? 'heading' : 'subheading',
          text,
        });
      }
      continue;
    }

    const bullet = line.match(/^[-*+]\s+(.*)$/);
    if (bullet) {
      flush();
      const text = cleanInline(bullet[1]);
      if (text) blocks.push({ type: 'bullet', text });
      continue;
    }

    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      flush();
      const text = cleanInline(numbered[2]);
      if (text) blocks.push({ type: 'numbered', text, prefix: `${numbered[1]}.` });
      continue;
    }

    paragraph.push(line);
  }

  flush();
  return blocks;
}

function fitFontSize(
  doc: PDFKit.PDFDocument,
  text: string,
  maxWidth: number,
  font: string,
  initialSize: number,
  minimumSize = 7
): number {
  doc.font(font);
  let size = initialSize;
  while (size > minimumSize) {
    doc.fontSize(size);
    if (doc.widthOfString(text) <= maxWidth) break;
    size -= 0.25;
  }
  return size;
}

function newPage(doc: PDFKit.PDFDocument): number {
  doc.addPage();
  return PAGE.top;
}

function ensureSpace(doc: PDFKit.PDFDocument, y: number, needed: number, bottom = BODY_BOTTOM): number {
  if (y + needed <= bottom) return y;
  return newPage(doc);
}

function drawDocumentHeader(
  doc: PDFKit.PDFDocument,
  company: { name?: string },
  title: string,
  number: string,
  status: string
): number {
  const brand = (company.name || 'VRAUNIX STUDIO').toUpperCase();
  const brandSize = fitFontSize(doc, brand, 280, 'Helvetica-Bold', 18, 12);
  doc.font('Helvetica-Bold').fontSize(brandSize).fillColor(BW.black)
    .text(brand, PAGE.top, PAGE.top, { lineBreak: false });

  doc.font('Helvetica-Bold').fontSize(20).fillColor(BW.black)
    .text(title, 350, 42, { width: 201, align: 'right', lineBreak: false });

  const numberSize = fitFontSize(doc, number, 201, 'Helvetica-Bold', 9.5, 7);
  doc.font('Helvetica-Bold').fontSize(numberSize).fillColor(BW.dark)
    .text(number, 350, 68, { width: 201, align: 'right', lineBreak: false });

  doc.font('Helvetica').fontSize(7.5).fillColor(BW.grayMid)
    .text(`STATUS  ${status}`, 350, 82, { width: 201, align: 'right', lineBreak: false });

  doc.strokeColor(BW.black).lineWidth(0.75)
    .moveTo(44, 98).lineTo(551, 98).stroke();

  return 112;
}

function drawMetaBlock(
  doc: PDFKit.PDFDocument,
  label: string,
  client: any,
  rightRows: { label: string; value: string }[],
  y: number
): number {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid)
    .text(label, 44, y, { lineBreak: false });

  const clientName = client?.name || 'Valued Client';
  const clientNameSize = fitFontSize(doc, clientName, 280, 'Helvetica-Bold', 10.5, 7.5);
  doc.font('Helvetica-Bold').fontSize(clientNameSize).fillColor(BW.black)
    .text(clientName, 44, y + 12, {
      width: 280,
      lineBreak: false,
    });

  const details = [client?.email, client?.phone, client?.address]
    .filter(Boolean)
    .join('  ·  ');

  let leftBottom = y + 24;
  if (details) {
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark);
    const detailsHeight = doc.heightOfString(details, { width: 280, lineGap: 2 });
    doc.text(details, 44, y + 25, { width: 280, lineGap: 2 });
    leftBottom = y + 25 + detailsHeight;
  }

  rightRows.forEach((row, index) => {
    const rowY = y + index * 14;
    doc.font('Helvetica-Bold').fontSize(7).fillColor(BW.grayMid)
      .text(row.label, 350, rowY, { width: 80, lineBreak: false });
    doc.font('Helvetica').fontSize(8.5).fillColor(BW.black)
      .text(row.value, 430, rowY - 0.5, {
        width: 121,
        align: 'right',
        lineBreak: false,
      });
  });

  const rightBottom = y + Math.max(rightRows.length * 14, 14);
  const bottom = Math.max(leftBottom, rightBottom) + 12;

  doc.strokeColor(BW.border).lineWidth(0.5)
    .moveTo(44, bottom).lineTo(551, bottom).stroke();

  return bottom + 14;
}

function drawProjectTitle(doc: PDFKit.PDFDocument, title: string | undefined, y: number): number {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid)
    .text('PROJECT SPECIFICATION', 44, y, { lineBreak: false });
  y += 12;

  const projectTitle = cleanInline(title) || 'Untitled Proposal';
  doc.font('Helvetica-Bold').fontSize(13).fillColor(BW.black);
  const height = doc.heightOfString(projectTitle, { width: PAGE.contentWidth, lineGap: 2 });
  doc.text(projectTitle, 44, y, { width: PAGE.contentWidth, lineGap: 2 });

  return y + height + 16;
}

function drawSectionHeading(
  doc: PDFKit.PDFDocument,
  index: string,
  title: string,
  y: number
): number {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid)
    .text(index, 44, y, { lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BW.black)
    .text(title.toUpperCase(), 64, y - 0.5, {
      width: PAGE.contentWidth - 20,
      lineBreak: false,
    });
  doc.strokeColor(BW.border).lineWidth(0.5)
    .moveTo(44, y + 12).lineTo(551, y + 12).stroke();
  return y + 20;
}

function drawRichText(
  doc: PDFKit.PDFDocument,
  value: unknown,
  x: number,
  y: number,
  width: number,
  bottom = BODY_BOTTOM
): number {
  const blocks = parseTextBlocks(value);
  let cursor = y;

  for (const block of blocks) {
    if (block.type === 'space') {
      cursor += 6;
      continue;
    }

    let font = 'Helvetica';
    let size = 8.5;
    let gap = 4;
    let textWidth = width;
    let textX = x;
    let prefix: string | null = null;

    if (block.type === 'heading') {
      font = 'Helvetica-Bold';
      size = 9.5;
      gap = 3;
    } else if (block.type === 'subheading') {
      font = 'Helvetica-Bold';
      size = 9;
      gap = 3;
    } else if (block.type === 'bullet') {
      prefix = '•';
      textWidth = width - 14;
      textX = x + 14;
    } else if (block.type === 'numbered') {
      prefix = block.prefix ?? '';
      textWidth = width - 24;
      textX = x + 24;
    }

    doc.font(font).fontSize(size);
    const height = doc.heightOfString(block.text, { width: textWidth, lineGap: 2.5 });
    const needed = height + gap + (block.type === 'heading' || block.type === 'subheading' ? 3 : 0);

    if (cursor + needed > bottom) {
      cursor = newPage(doc);
    }

    doc.font(font).fontSize(size).fillColor(block.type === 'heading' || block.type === 'subheading' ? BW.black : BW.grayDark);

    if (prefix) {
      doc.font('Helvetica').fontSize(size).fillColor(BW.grayMid)
        .text(prefix, x, cursor + 0.5, { width: prefix === '•' ? 10 : 22, lineBreak: false });
    }

    doc.font(font).fontSize(size).fillColor(block.type === 'heading' || block.type === 'subheading' ? BW.black : BW.grayDark)
      .text(block.text, textX, cursor, { width: textWidth, lineGap: 2.5 });

    cursor += height + gap + (block.type === 'heading' || block.type === 'subheading' ? 3 : 0);
  }

  return cursor;
}

function drawScopeItems(
  doc: PDFKit.PDFDocument,
  items: string[],
  y: number
): number {
  let cursor = y;
  const width = PAGE.contentWidth - 14;

  for (const raw of items) {
    const item = cleanInline(raw);
    if (!item) continue;

    doc.font('Helvetica').fontSize(8.5);
    const height = doc.heightOfString(item, { width, lineGap: 2 });
    const needed = Math.max(16, height + 5);

    if (cursor + needed > BODY_BOTTOM) {
      cursor = newPage(doc);
    }

    doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayMid)
      .text('•', 44, cursor + 0.5, { width: 10, lineBreak: false });
    doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark)
      .text(item, 58, cursor, { width, lineGap: 2 });

    cursor += needed;
  }

  return cursor;
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number): number {
  doc.save();
  doc.rect(44, y, PAGE.contentWidth, TABLE.headerHeight).fill('#F7F7F7');
  doc.restore();

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.black)
    .text('DESCRIPTION', TABLE.descriptionX, y + 7, {
      width: TABLE.descriptionWidth,
      lineBreak: false,
    });
  doc.text('QTY', TABLE.quantityX, y + 7, {
    width: TABLE.quantityWidth,
    align: 'center',
    lineBreak: false,
  });
  doc.text('RATE', TABLE.rateX, y + 7, {
    width: TABLE.rateWidth,
    align: 'right',
    lineBreak: false,
  });
  doc.text('AMOUNT', TABLE.amountX, y + 7, {
    width: TABLE.amountWidth,
    align: 'right',
    lineBreak: false,
  });

  doc.strokeColor(BW.black).lineWidth(0.75)
    .moveTo(44, y + TABLE.headerHeight).lineTo(551, y + TABLE.headerHeight).stroke();

  return y + TABLE.headerHeight;
}

function drawRightText(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  size = 8.5,
  bold = false
): void {
  const font = bold ? 'Helvetica-Bold' : 'Helvetica';
  const fontSize = fitFontSize(doc, text, width - 2, font, size, 6.25);
  doc.font(font).fontSize(fontSize).fillColor(bold ? BW.black : BW.dark)
    .text(text, x, y, { width, align: 'right', lineBreak: false });
}

function drawCenteredText(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  width: number,
  size = 8.5
): void {
  const fontSize = fitFontSize(doc, text, width - 2, 'Helvetica', size, 6.25);
  doc.font('Helvetica').fontSize(fontSize).fillColor(BW.dark)
    .text(text, x, y, { width, align: 'center', lineBreak: false });
}

function tableRowHeight(
  doc: PDFKit.PDFDocument,
  description: string
): number {
  doc.font('Helvetica').fontSize(8.5);
  const height = doc.heightOfString(description, {
    width: TABLE.descriptionWidth,
    lineGap: 2,
  });
  return Math.max(20, height + 10);
}

function drawTableRow(
  doc: PDFKit.PDFDocument,
  row: {
    description: string;
    quantity: string;
    rate: string;
    amount: string;
    height: number;
  },
  y: number
): number {
  doc.font('Helvetica').fontSize(8.5).fillColor(BW.dark)
    .text(row.description, TABLE.descriptionX, y + 5, {
      width: TABLE.descriptionWidth,
      lineGap: 2,
    });

  drawCenteredText(
    doc,
    row.quantity,
    TABLE.quantityX,
    y + 5,
    TABLE.quantityWidth,
    8.5
  );

  drawRightText(doc, row.rate, TABLE.rateX, y + 5, TABLE.rateWidth, 8.5, false);
  drawRightText(doc, row.amount, TABLE.amountX, y + 5, TABLE.amountWidth, 8.5, true);

  doc.strokeColor(BW.border).lineWidth(0.5)
    .moveTo(44, y + row.height).lineTo(551, y + row.height).stroke();

  return y + row.height;
}

function drawProposalTotal(
  doc: PDFKit.PDFDocument,
  y: number,
  total: string
): number {
  if (y + 56 > BODY_BOTTOM) {
    y = newPage(doc);
  }

  doc.strokeColor(BW.black).lineWidth(1)
    .moveTo(44, y).lineTo(551, y).stroke();
  y += 9;

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(BW.black)
    .text('TOTAL VALUATION', 44, y, { lineBreak: false });
  drawRightText(doc, total, 350, y - 2, 201, 13, true);
  y += 22;

  doc.strokeColor(BW.black).lineWidth(1)
    .moveTo(44, y).lineTo(551, y).stroke();

  return y + 16;
}

function drawProposalClosing(
  doc: PDFKit.PDFDocument,
  settings: any,
  y: number
): number {
  const terms = cleanBlock(
    settings?.proposal?.defaultTerms ||
      'This proposal is valid for the period stated above. Pricing and scope are based on the information available at the time of preparation.'
  );
  const nextSteps = cleanBlock(settings?.proposal?.nextSteps);

  doc.font('Helvetica').fontSize(8);
  const termsHeight = terms ? doc.heightOfString(terms, { width: PAGE.contentWidth, lineGap: 3 }) : 0;
  const nextStepsHeight = nextSteps ? doc.heightOfString(nextSteps, { width: PAGE.contentWidth, lineGap: 3 }) : 0;
  const needed = 24 + termsHeight + (nextSteps ? nextStepsHeight + 20 : 0);

  if (y + needed > BODY_BOTTOM) {
    y = newPage(doc);
  }

  y = drawSectionHeading(doc, '04', 'Terms & Next Steps', y);

  if (terms) {
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
      .text(terms, 44, y, { width: PAGE.contentWidth, lineGap: 3 });
    y += termsHeight + 10;
  }

  if (nextSteps) {
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid)
      .text('NEXT STEPS', 44, y, { lineBreak: false });
    y += 12;
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
      .text(nextSteps, 44, y, { width: PAGE.contentWidth, lineGap: 3 });
    y += nextStepsHeight;
  }

  return y;
}

function drawInvoiceSummary(
  doc: PDFKit.PDFDocument,
  invoice: any,
  settings: any,
  y: number
): number {
  const notes = cleanBlock(
    invoice.notes ||
      settings?.invoice?.paymentTerms ||
      'Payment is due by the date shown above. Please include the invoice number with your payment.'
  );

  doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark);
  const notesHeight = notes
    ? doc.heightOfString(notes, { width: 250, lineGap: 3 })
    : 0;

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BW.grayMid)
    .text('PAYMENT TERMS', 44, y, { lineBreak: false });
  if (notes) {
    doc.font('Helvetica').fontSize(8).fillColor(BW.grayDark)
      .text(notes, 44, y + 13, { width: 250, lineGap: 3 });
  }

  const rightX = 331;
  const valueX = 451;
  const valueWidth = 100;
  let rowY = y;

  const row = (label: string, value: string, bold = false, size = 8.5) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size)
      .fillColor(bold ? BW.black : BW.grayDark)
      .text(label, rightX, rowY, { lineBreak: false });
    drawRightText(doc, value, valueX, rowY, valueWidth, size, bold);
    rowY += 16;
  };

  row('Subtotal:', money(invoice.subtotalMinor || 0, invoice.currency));

  if (invoice.discountMinor && invoice.discountMinor > 0) {
    row('Discount:', `-${money(invoice.discountMinor, invoice.currency)}`);
  }

  if (invoice.taxMinor && invoice.taxMinor > 0) {
    row(`Tax (${invoice.taxRatePercent || 0}%):`, money(invoice.taxMinor, invoice.currency));
  }

  doc.strokeColor(BW.border).lineWidth(0.5)
    .moveTo(rightX, rowY + 1).lineTo(551, rowY + 1).stroke();
  rowY += 8;

  row('TOTAL', money(invoice.totalMinor || 0, invoice.currency), true, 10);
  row('Amount paid:', money(invoice.amountPaidMinor || 0, invoice.currency));

  doc.strokeColor(BW.black).lineWidth(1)
    .moveTo(rightX, rowY + 1).lineTo(551, rowY + 1).stroke();
  rowY += 8;

  row('BALANCE DUE', money(invoice.balanceMinor || 0, invoice.currency), true, 10);

  return Math.max(y + notesHeight + 13, rowY);
}

export function generateProposalPDF(proposal: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44 });
  const company = settings?.company || { name: 'VRAUNIX STUDIO' };
  const currency = proposal.pricing?.currency || 'NPR';

  let y = drawDocumentHeader(
    doc,
    company,
    'PROPOSAL',
    proposal.number || 'PROP-DRAFT',
    String(proposal.status || 'draft').toUpperCase().replace(/_/g, ' ')
  );

  const createdDate = new Date(proposal.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const validUntilDays = settings?.proposal?.validityDays || 30;
  const validDate = new Date(
    new Date(proposal.createdAt || Date.now()).getTime() + validUntilDays * 86400000
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  y = drawMetaBlock(doc, 'PREPARED FOR', client, [
    { label: 'DATE', value: createdDate },
    { label: 'VALID UNTIL', value: validDate },
  ], y);

  y = drawProjectTitle(doc, proposal.title, y);

  if (proposal.description) {
    y = ensureSpace(doc, y, 44);
    y = drawSectionHeading(doc, '01', 'Project Overview', y);
    y = drawRichText(doc, proposal.description, 44, y, PAGE.contentWidth);
    y += 10;
  }

  if (proposal.scope && proposal.scope.length > 0) {
    y = ensureSpace(doc, y, 44);
    y = drawSectionHeading(doc, '02', 'Scope of Work & Deliverables', y);
    y = drawScopeItems(doc, proposal.scope, y);
    y += 12;
  }

  y = ensureSpace(doc, y, 70);
  y = drawSectionHeading(doc, '03', 'Commercial Valuation', y);

  const lines = Array.isArray(proposal.pricing?.lines) ? proposal.pricing.lines : [];
  if (lines.length > 0) {
    const tableBottom = PAGE.bottom - 74;

    if (y + TABLE.headerHeight + 24 > tableBottom) {
      y = newPage(doc);
    }

    y = drawTableHeader(doc, y);

    for (const line of lines) {
      const description = cleanInline(line.description) || 'Project item';
      const quantity = String(line.quantity || '1');
      const numericQuantity = Number.parseFloat(quantity) || 1;
      const unitPriceMinor = Number(line.unitPriceMinor || 0);
      const rowHeight = tableRowHeight(doc, description);

      if (y + rowHeight > tableBottom) {
        y = newPage(doc);
        y = drawTableHeader(doc, y);
      }

      y = drawTableRow(doc, {
        description,
        quantity,
        rate: money(unitPriceMinor, currency),
        amount: money(unitPriceMinor * numericQuantity, currency),
        height: rowHeight,
      }, y);
    }

    y += 8;
  }

  y = drawProposalTotal(
    doc,
    y,
    money(proposal.pricing?.totalMinor || 0, currency)
  );

  drawProposalClosing(doc, settings, y);

  doc.end();
  return doc;
}

export function generateInvoicePDF(invoice: any, client: any, settings?: any): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 44 });
  const company = settings?.company || { name: 'VRAUNIX STUDIO' };
  const currency = invoice.currency || 'NPR';

  let y = drawDocumentHeader(
    doc,
    company,
    'INVOICE',
    invoice.number || 'INV-DRAFT',
    String(invoice.status || 'draft').toUpperCase().replace(/_/g, ' ')
  );

  const issueDate = new Date(invoice.issueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const dueDate = new Date(invoice.dueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  y = drawMetaBlock(doc, 'BILLED TO', client, [
    { label: 'INVOICE DATE', value: issueDate },
    { label: 'PAYMENT DUE', value: dueDate },
  ], y);

  const paymentNotes = cleanBlock(
    invoice.notes ||
      settings?.invoice?.paymentTerms ||
      'Payment is due by the date shown above. Please include the invoice number with your payment.'
  );
  doc.font('Helvetica').fontSize(8);
  const notesHeight = doc.heightOfString(paymentNotes, { width: 250, lineGap: 3 });
  const summaryReserve = Math.max(165, notesHeight + 48);
  const tableBottom = Math.max(PAGE.top + 120, PAGE.bottom - summaryReserve);

  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  y += 8;

  if (items.length > 0) {
    if (y + TABLE.headerHeight + 24 > tableBottom) {
      y = newPage(doc);
    }

    y = drawTableHeader(doc, y);

    for (const item of items) {
      const description = cleanInline(item.description) || 'Billable item';
      const quantity = String(item.quantity || '1');
      const unitPriceMinor = Number(item.unitPriceMinor || 0);
      const amountMinor = Number(item.amountMinor || unitPriceMinor * (Number.parseFloat(quantity) || 1));
      const rowHeight = tableRowHeight(doc, description);

      if (y + rowHeight > tableBottom) {
        y = newPage(doc);
        y = drawTableHeader(doc, y);
      }

      y = drawTableRow(doc, {
        description,
        quantity,
        rate: money(unitPriceMinor, currency),
        amount: money(amountMinor, currency),
        height: rowHeight,
      }, y);
    }

    y += 12;
  } else {
    doc.font('Helvetica').fontSize(8.5).fillColor(BW.grayDark)
      .text('No billable items have been added to this invoice.', 44, y, {
        width: PAGE.contentWidth,
      });
    y = doc.y + 18;
  }

  if (y + summaryReserve > PAGE.bottom) {
    y = newPage(doc);
  }

  drawInvoiceSummary(doc, invoice, settings, y);

  doc.end();
  return doc;
}
