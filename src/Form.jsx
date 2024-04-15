import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Form = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('B.tech');

  const handleGeneratePdf = () => {
    const selectedCourse = course; // Get the course value from state
    const studentName = name; // Get the name value from state
  
    const doc = new jsPDF();
    const templateText = selectedCourse === 'B.tech' ? getBtechTemplate() : getMtechTemplate();
  
    const filledTemplate = templateText
      .replace('{{NAME}}', studentName)
      .replace('{{DATE}}', new Date().toLocaleDateString());
  
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text(filledTemplate, 10, 10);
  
    const feeStructureHeader = 'Year     One time fee.     Tuition fee.';
    const feeStructureRows = selectedCourse === 'B.tech'
      ? [
          '1        600              260',
          '2        -                260'
        ]
      : [
          '1        500              160',
          '2        -                160'
        ];
  
    drawFeeStructure(doc, 17, 60, feeStructureHeader, feeStructureRows);
  
    doc.save('offer_letter.pdf');
  };
  
  
  const drawFeeStructure = (doc, x, y, header, rows) => {
    const rowHeight = 10;
    const columnWidth = 60;
    const numColumns = 3;
  
    // Draw rectangle around fee structure
    doc.rect(x, y, columnWidth * numColumns, (rows.length + 1) * rowHeight);
  
    // Add header text and horizontal line after header
    const headerData = header.split(/\s{2,}/); // Split header by multiple spaces
    headerData.forEach((cell, index) => {
      const cellX = x + index * columnWidth;
      doc.text(cell.trim(), cellX+5, y + 5);
  
      // Draw vertical lines after the first and second headers
      if (index === 1 || index === 2) {
        doc.line(cellX, y, cellX, y + (rows.length + 1) * rowHeight);
      }
    });
  
    // Draw horizontal line after header
    const headerLineY = y + rowHeight;
    doc.line(x, headerLineY, x + columnWidth * numColumns, headerLineY);
  
    // Add rows of fee structure
    rows.forEach((row, rowIndex) => {
      const rowData = row.split(/\s+/); // Split row data by spaces
      rowData.forEach((cell, colIndex) => {
        const cellY = y + 5 + (rowIndex + 1) * rowHeight;
        doc.text(cell, x + 5 + colIndex * columnWidth, cellY);
      });
  
      // Draw horizontal line after each row
      if (rowIndex === 0) {
        const lineY = y + 5 + (rowIndex + 1.3) * rowHeight; // Calculate y-coordinate for the line
        doc.line(x, lineY, x + columnWidth * 3, lineY); // Horizontal line after first row
      }
    });
  };
  
  
  const getBtechTemplate = () => {
    return `
      Ref- B101
  
      Name: {{NAME}}
  
      Course: B.tech
  
      Date of Offer (current date): {{DATE}}
  
      Fee Structure:
    `;
  };
  
  const getMtechTemplate = () => {
    return `
      Ref- A101
  
      Name: {{NAME}}
  
      Course: M.tech
  
      Date of Offer (current date): {{DATE}}
  
      Fee Structure:
    `;
  };
  return (
    <div>
      <h2 className='text-2xl items-center justify-center m-6'>Generate PDF Form</h2>
      <form onSubmit={handleGeneratePdf}>
        <label className='m-6 mb-0 flex flex-col'>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className= 'border border-black rounded-lg text-black p-2'
          />
        </label>
        <br />
        <label className='m-6 mt-0 flex flex-col'> 
          Course:
          <select value={course} onChange={(e) => setCourse(e.target.value)}
          className= 'border border-black rounded-lg text-black p-2'
          >
            <option value="B.tech">B.tech</option>
            <option value="M.tech">M.tech</option>
          </select>
        </label>
        <br />

       <div className='flex justify-start gap-10 ml-10'>
       <button className='border border-black rounded-lg text-black p-2 bg-blue-500 hover:bg-blue-800 hover:text-white'>Submit</button>
        <button type="submit" className='border border-black rounded-lg text-black p-2 bg-green-400 hover:bg-green-700 hover:text-white'>Generate PDF</button>
       </div>
      </form>
    </div>
  );
};

export default Form;
