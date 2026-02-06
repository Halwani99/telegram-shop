const tg = window.Telegram.WebApp;

// ================== المنتجات ==================
const products = [
  {id:1, name:"خاتم فاخر", price:"100,000 ل.س", category:"خواتم", image:"https://picsum.photos/200?random=1"},
  {id:2, name:"سوار نسائي", price:"50,000 ل.س", category:"أسوار", image:"https://picsum.photos/200?random=2"},
  {id:3, name:"عقد أسود", price:"75,000 ل.س", category:"سلاسل", image:"https://picsum.photos/200?random=3"},
  {id:4, name:"ساعة أنيقة", price:"200,000 ل.س", category:"ساعات", image:"https://picsum.photos/200?random=4"},
  {id:5, name:"خاتم ماسي", price:"150,000 ل.س", category:"خواتم", image:"https://picsum.photos/200?random=5"}
];

let cart = [];

// ================== الفئات ==================
const categories = [...new Set(products.map(p=>p.category))];

function renderCategories() {
  const container = document.getElementById("categories");
  container.innerHTML = categories.map(c=>`
    <button class="category-btn" onclick="showProducts('${c}')">${c}</button>
  `).join("");
}

// ================== عرض المنتجات ==================
function showProducts(category) {
  const container = document.getElementById("products-container");
  const filtered = products.filter(p=>p.category===category);

  container.innerHTML = filtered.map(p=>`
    <div class="product">
      <img src="${p.image}" class="product-img"/>
      <div class="product-info">
        <strong>${p.name}</strong>
        <p>السعر: ${p.price}</p>
        <div class="qty-control">
          <button onclick="decreaseQty(${p.id})">-</button>
          <span id="qty-${p.id}">1</span>
          <button onclick="increaseQty(${p.id})">+</button>
        </div>
        <button class="add-cart-btn" onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </div>
  `).join("");
}

// ================== تعديل الكمية ==================
function increaseQty(id) {
  const span = document.getElementById(`qty-${id}`);
  span.innerText = parseInt(span.innerText) + 1;
}
function decreaseQty(id) {
  const span = document.getElementById(`qty-${id}`);
  if(parseInt(span.innerText) > 1) span.innerText = parseInt(span.innerText) - 1;
}

// ================== السلة ==================
function addToCart(id) {
  const product = products.find(p=>p.id===id);
  const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
  const existing = cart.find(p=>p.id===id);
  if(existing) existing.qty += qty;
  else cart.push({...product, qty});
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = cart.map(p=>`${p.name} x ${p.qty} - ${p.price}`).join("<br>");
  const total = cart.reduce((sum,p)=>{
    return sum + parseInt(p.price.replace(/,/g,"").replace(" ل.س",""))*p.qty;
  },0);
  document.getElementById("total").innerText = `المجموع: ${total.toLocaleString()} ل.س`;
}

// ================== إرسال الطلب ==================
function sendOrder() {
  if(cart.length===0) { alert("⚠️ السلة فارغة!"); return; }
  const orderData = {
    user_name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
    products: cart,
    total: cart.reduce((sum,p)=>sum+parseInt(p.price.replace(/,/g,"").replace(" ل.س",""))*p.qty,0)
  };
  tg.sendData(JSON.stringify(orderData));
  alert("✅ تم إرسال الطلب!");
  cart = [];
  renderCart();
  document.getElementById("name").value="";
  document.getElementById("phone").value="";
  document.getElementById("city").value="";
  document.getElementById("address").value="";
}

// ================== تهيئة الصفحة ==================
document.addEventListener("DOMContentLoaded", ()=>{
  renderCategories();
  showProducts(categories[0]);
});
