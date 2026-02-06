let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحميل البيانات
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    renderCategories(data);
    renderProducts(data);
  });

/* =====================
   عرض الفئات
===================== */
function renderCategories(data) {
  const container = document.getElementById("categories");
  if (!container) return;

  data.categories.forEach(cat => {
    container.innerHTML += `
      <div class="card" onclick="openCategory('${cat.id}', '${cat.name}')">
        <h3>${cat.name}</h3>
      </div>
    `;
  });
}

function openCategory(id, name) {
  localStorage.setItem("currentCategory", JSON.stringify({ id, name }));
  window.location.href = "category.html";
}

/* =====================
   عرض المنتجات حسب الفئة
===================== */
function renderProducts(data) {
  const container = document.getElementById("products");
  if (!container) return;

  const cat = JSON.parse(localStorage.getItem("currentCategory"));
  document.getElementById("catTitle").innerText = cat.name;

  data.products
    .filter(p => p.category === cat.id)
    .forEach(p => {
      const itemInCart = cart.find(i => i.id === p.id);
      const qty = itemInCart ? itemInCart.qty : 0;

      container.innerHTML += `
        <div class="card">
          <img src="${p.image}">
          <h4>${p.name}</h4>
          <p>${p.price}$</p>

          <div class="qty">
            <button onclick="changeQty(${p.id}, '${p.name}', ${p.price}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${p.id}, '${p.name}', ${p.price}, 1)">+</button>
          </div>
        </div>
      `;
    });
}

/* =====================
   السلة (إضافة / إزالة)
===================== */
function changeQty(id, name, price, delta) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  } else if (delta > 0) {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

/* =====================
   إرسال الطلب
===================== */
function submitOrder() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  const order = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0)
  };

  // Telegram Mini App
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(order));
  } else {
    alert(JSON.stringify(order, null, 2));
  }

  localStorage.removeItem("cart");
}
