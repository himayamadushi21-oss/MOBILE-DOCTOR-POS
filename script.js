let bill = [];
let stock = JSON.parse(localStorage.getItem('md_stock')) || [];
let todaySell = parseFloat(localStorage.getItem('md_sell')) || 0;

const billBody = document.querySelector('#billTable tbody');
const stockBody = document.querySelector('#stockTable tbody');
const billTotalSpan = document.getElementById('billTotal');
const todaySellSpan = document.getElementById('todaySell');

function saveData() {
  localStorage.setItem('md_stock', JSON.stringify(stock));
  localStorage.setItem('md_sell', todaySell);
}

function renderStock() {
  stockBody.innerHTML = '';
  stock.forEach(s => {
    stockBody.innerHTML += `<tr><td>${s.name}</td><td>${s.qty}</td></tr>`;
  });
}

function renderBill() {
  billBody.innerHTML = '';
  let total = 0;
  bill.forEach(b => {
    total += b.qty * b.price;
    billBody.innerHTML += `<tr><td>${b.name}</td><td>${b.qty}</td><td>${b.qty*b.price}</td></tr>`;
  });
  billTotalSpan.textContent = total.toFixed(2);
  todaySellSpan.textContent = todaySell.toFixed(2);
}

// Add to Bill
document.getElementById('addToBillBtn').addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const qty = parseInt(document.getElementById('itemQty').value);
  const price = parseFloat(document.getElementById('itemPrice').value);
  if (!name || !qty || !price) return alert('Okkomma fill karanna');
  bill.push({ name, qty, price });
  document.getElementById('itemName').value = '';
  document.getElementById('itemQty').value = 1;
  document.getElementById('itemPrice').value = '';
  renderBill();
});

// Sell Complete
document.getElementById('printBillBtn').addEventListener('click', () => {
  if (bill.length === 0) return alert('Bill eka hitiya na');
  let total = bill.reduce((sum, b) => sum + b.qty * b.price, 0);
  todaySell += total;
  
  // Stock adu karanawa
  bill.forEach(b => {
    let s = stock.find(x => x.name.toLowerCase() === b.name.toLowerCase());
    if (s) s.qty = Math.max(0, s.qty - b.qty);
  });
  
  saveData();
  alert(`Sell Complete! Total: Rs. ${total.toFixed(2)}`);
  bill = [];
  renderBill();
  renderStock();
});

// Add Stock
document.getElementById('addStockBtn').addEventListener('click', () => {
  const name = document.getElementById('stockName').value.trim();
  const qty = parseInt(document.getElementById('stockQty').value);
  if (!name || !qty) return alert('Item + Gana daninna');
  
  let s = stock.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (s) s.qty += qty;
  else stock.push({ name, qty });
  
  document.getElementById('stockName').value = '';
  document.getElementById('stockQty').value = '';
  saveData();
  renderStock();
});

renderStock();
renderBill();
let billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];