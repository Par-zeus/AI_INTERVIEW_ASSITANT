// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';

export const generatePDF = (transcript) => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  transcript.forEach((item, index) => {
    doc.text(`Question ${index + 1}: ${item}`, 10, 10 + (index * 10));
  });
  doc.save('transcript.pdf');
};
