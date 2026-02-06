const tg = window.Telegram.WebApp;

const products = [
  {id:1, name:"خاتم فاخر", price:"100,000 ل.س", category:"خواتم", image:"https://via.placeholder.com/150"},
  {id:2, name:"سوار نسائي", price:"50,000 ل.س", category:"أسوار", image:"https://via.placeholder.com/150"},
  {id:3, name:"عقد أسود", price:"75,000 ل.س", category:"سلاسل", image:"https://via.placeholder.com/150"},
  {id:4, name:"ساعة أنيقة", price:"200,000 ل.س", category:"ساعات", image:"https://via.placeholder.com/150"},
  {id:5, name:"خاتم ماسي", price:"150,000 ل.س", category:"خواتم", image:"https://via.placeholder.com/150"}
];

const cart = [];

const categories = [...new Set(products.map(p=>p.category))];

function renderCategories() {
  const container = document.getElementById("categories");
  container.innerHTML = categories.map(c=>`<button class="category-btn" onclick="showProducts('${c}')">${c}</button>`).join("");
}

function showProducts(category) {
  const container = document.getElementById("products-container");
  const filtered = products.filter(p=>p.category===category);
  container.innerHTML = filtered.map(p=>`
    <div class="product">
      <img src="${p.image}" width="100%" />
      <strong>${p.name}</strong><br>
      السعر: ${p.price}<br>
      <button onclick="addToCart(${p.id})">أضف للسلة</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p=>p.id===id);
  cart.push(product);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = cart.map(p=>`${p.name} - ${p.price}`).join("<br>");
  const total = cart.reduce((sum,p)=>sum+parseInt(p.price.replace(/,/g,"").replace(" ل.س","")),0);
  document.getElementById("total").innerText = `المجموع: ${total.toLocaleString()} ل.س`;
}

function sendOrder() {
  if(cart.length===0) { alert("⚠️ السلة فارغة!"); return; }
  const orderData = {
    user_name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    products: cart,
    total: cart.reduce((sum,p)=>sum+parseInt(p.price.replace(/,/g,"").replace(" ل.س","")),0)
  };
  tg.sendData(JSON.stringify(orderData));
  alert("✅ تم إرسال الطلب!");
  cart.length=0; renderCart();
  document.getElementById("name").value=""; document.getElementById("phone").value=""; document.getElementById("address").value="";
}

// تهيئة الصفحة
renderCategories();
showProducts(categories[0]);
