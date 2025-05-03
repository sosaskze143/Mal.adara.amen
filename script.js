
document.getElementById("transferForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const serial = document.getElementById("serialInput").value.trim();
  const newOwner = document.getElementById("newOwner").value;
  const currency = currencyData.find(c => c.serial === serial);

  if (!currency) {
    document.getElementById("result").textContent = "العملة غير موجودة.";
    return;
  }

  const oldOwner = currency.owner;
  currency.owner = newOwner;
  currency.id = persons[newOwner];

  const now = new Date();
  const date = now.toLocaleDateString("ar-EG");
  const time = now.getSeconds();
  const approvalCode = generateUniqueCode();

  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 14;

  page.drawText(`تاريخ العملية: ${date}`, { x: 50, y: height - 50, size: fontSize });
  page.drawText(`الوقت (بالثواني): ${time}`, { x: 50, y: height - 80, size: fontSize });
  page.drawText(`رقم الموافقة: ${approvalCode}`, { x: 50, y: height - 110, size: fontSize });
  page.drawText(`من: ${oldOwner}`, { x: 50, y: height - 140, size: fontSize });
  page.drawText(`إلى: ${newOwner}`, { x: 50, y: height - 170, size: fontSize });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `عملية_نقل_${serial}.pdf`;
  link.click();

  document.getElementById("result").textContent = "تم نقل العملة وتوليد ملف PDF.";
});

function generateUniqueCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

document.getElementById("downloadExcel").addEventListener("click", function() {
  let csvContent = "رقم العملة,المبلغ,المالك الحالي,رقم الهوية
";
  
  currencyData.forEach(currency => {
    csvContent += `${currency.serial},${currency.amount},${currency.owner},${currency.id}
`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "العمليات.csv";
  link.click();
});
