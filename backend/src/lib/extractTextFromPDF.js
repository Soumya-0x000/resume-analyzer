import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs/promises';

export const extractTextFromPDF = async (input) => {
    let buffer;

    if (Buffer.isBuffer(input)) {
        buffer = input;
    } else if (input?.buffer) {
        buffer = input.buffer; // multer memoryStorage
    } else if (input?.path) {
        buffer = await fs.readFile(input.path); // multer diskStorage
    } else if (typeof input === 'string') {
        buffer = await fs.readFile(input); // direct file path
    } else {
        throw new Error('Invalid PDF input');
    }

    const uint8Array = new Uint8Array(buffer);
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
};
