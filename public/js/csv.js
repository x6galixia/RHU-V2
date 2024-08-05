document.getElementById('downloadbtn').addEventListener('click', downloadCSV);
document.getElementById('printbtn').addEventListener('click', printCSV);

function generateCSV() {
  const table = document.getElementById('medicineTable');
  const rows = Array.from(table.querySelectorAll('tr'));
  const csvData = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(',');
  }).join('\n');
  return csvData;
}

function downloadCSV() {
  const csvData = generateCSV();
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function printCSV() {
  const csvData = generateCSV();
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write('<pre>' + csvData + '</pre>');
  printWindow.document.close();
  printWindow.print();
}