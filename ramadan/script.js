// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: "Kıymalı Pide",
    category: "etli",
    emoji: "🫓",
    desc: "Taze kıyma, soğan, domates ve baharatlarla hazırlanan klasik kıymalı pide.",
    price: 120,
    oldPrice: 150,
    badge: "popular",
    badgeText: "En Çok Satan",
  },
  {
    id: 2,
    name: "Kuşbaşılı Pide",
    category: "etli",
    emoji: "🥩",
    desc: "Küp küp doğranmış dana eti, biber ve domatesle hazırlanan doyurucu pide.",
    price: 145,
    oldPrice: null,
    badge: null,
    badgeText: null,
  },
  {
    id: 3,
    name: "Sucuklu Pide",
    category: "etli",
    emoji: "🌶️",
    desc: "Özel baharatlı sucuk ve kaşar peyniriyle hazırlanan lezzetli pide.",
    price: 130,
    oldPrice: null,
    badge: "new",
    badgeText: "Yeni",
  },
  {
    id: 4,
    name: "Kaşarlı Pide",
    category: "peynirli",
    emoji: "🧀",
    desc: "Bol bol erimiş kaşar peyniriyle hazırlanan sade ama lezzetli pide.",
    price: 100,
    oldPrice: 120,
    badge: null,
    badgeText: null,
  },
  {
    id: 5,
    name: "Peynirli Pide",
    category: "peynirli",
    emoji: "🫕",
    desc: "Beyaz peynir, kaşar ve lor peyniri karışımıyla hazırlanan üç peynirli pide.",
    price: 115,
    oldPrice: null,
    badge: "popular",
    badgeText: "Popüler",
  },
  {
    id: 6,
    name: "Ispanaklı Pide",
    category: "sebzeli",
    emoji: "🥬",
    desc: "Taze ıspanak, soğan ve beyaz peynirle hazırlanan sağlıklı ve lezzetli pide.",
    price: 95,
    oldPrice: null,
    badge: null,
    badgeText: null,
  },
  {
    id: 7,
    name: "Patatesli Pide",
    category: "sebzeli",
    emoji: "🥔",
    desc: "Haşlanmış patates, soğan ve baharatlarla hazırlanan doyurucu sebzeli pide.",
    price: 90,
    oldPrice: 110,
    badge: null,
    badgeText: null,
  },
  {
    id: 8,
    name: "Karışık Pide",
    category: "ozel",
    emoji: "🎯",
    desc: "Kıyma, sucuk, kaşar ve sebzelerle hazırlanan her şeyin bir arada olduğu özel pide.",
    price: 160,
    oldPrice: 190,
    badge: "popular",
    badgeText: "Özel",
  },
  {
    id: 9,
    name: "Yumurtalı Kıymalı Pide",
    category: "etli",
    emoji: "🍳",
    desc: "Kıymalı pidenin üzerine taze yumurta kırılarak pişirilen özel lezzet.",
    price: 135,
    oldPrice: null,
    badge: null,
    badgeText: null,
  },
  {
    id: 10,
    name: "Ramazan Özel Pidesi",
    category: "ozel",
    emoji: "🌙",
    desc: "Ramazan'a özel hazırlanan, kuşbaşı et, kaşar ve özel baharatlarla yapılan pide.",
    price: 175,
    oldPrice: 210,
    badge: "new",
    badgeText: "Ramazan Özel",
  },
  {
    id: 11,
    name: "Mantarlı Pide",
    category: "sebzeli",
    emoji: "🍄",
    desc: "Taze mantar, soğan, sarımsak ve kaşar peyniriyle hazırlanan nefis pide.",
    price: 110,
    oldPrice: null,
    badge: null,
    badgeText: null,
  },
  {
    id: 12,
    name: "Tavuklu Pide",
    category: "ozel",
    emoji: "🍗",
    desc: "Izgara tavuk parçaları, biber ve özel sosla hazırlanan hafif ve lezzetli pide.",
    price: 140,
    oldPrice: 165,
    badge: "new",
    badgeText: "Yeni",
  },
];

// ===== STATE =====
let cart = [];
let activeFilter = "all";

// ===== DOM ELEMENTS =====
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const subtotalPrice = document.getElementById("subtotalPrice");
const deliveryFee = document.getElementById("deliveryFee");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderModal = document.getElementById("orderModal");
const successModal = document.getElementById("successModal");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");
const successClose = document.getElementById("successClose");
const orderForm = document.getElementById("orderForm");
const toastContainer = document.getElementById("toastContainer");
const filterTabs = document.querySelectorAll(".filter-tab");

// ===== DELIVERY FEE =====
const DELIVERY_FEE = 15;

// ===== RENDER PRODUCTS =====
function renderProducts(filter = "all") {
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  productsGrid.innerHTML = filtered
    .map(
      (product) => `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      ${product.badge ? `<span class="product-badge ${product.badge}">${product.badgeText}</span>` : ""}
      <div class="product-img">${product.emoji}</div>
      <div class="product-info">
        <div class="product-category">${getCategoryLabel(product.category)}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">₺${product.price.toFixed(2).replace(".", ",")}</span>
            ${product.oldPrice ? `<span class="price-old">₺${product.oldPrice.toFixed(2).replace(".", ",")}</span>` : ""}
          </div>
          <button class="add-to-cart" onclick="addToCart(${product.id}, this)">
            🛒 Ekle
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function getCategoryLabel(cat) {
  const labels = {
    etli: "🥩 Etli Pide",
    peynirli: "🧀 Peynirli Pide",
    sebzeli: "🥬 Sebzeli Pide",
    ozel: "⭐ Özel Pide",
  };
  return labels[cat] || cat;
}

// ===== FILTER TABS =====
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    renderProducts(activeFilter);
  });
});

// ===== ADD TO CART =====
function addToCart(productId, btn) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  // Button feedback
  btn.classList.add("added");
  btn.innerHTML = "✅ Eklendi";
  setTimeout(() => {
    btn.classList.remove("added");
    btn.innerHTML = "🛒 Ekle";
  }, 1500);

  updateCart();
  showToast(`🫓 ${product.name} sepete eklendi!`);
}

// ===== UPDATE CART UI =====
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  // Animate cart count
  cartCount.style.animation = "none";
  cartCount.offsetHeight; // reflow
  cartCount.style.animation = "pulse 0.3s ease";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <h3>Sepetiniz Boş</h3>
        <p>Menüden pide seçerek sepetinize ekleyebilirsiniz.</p>
      </div>
    `;
    cartFooter.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₺${item.price.toFixed(2).replace(".", ",")} / adet</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Kaldır">🗑️</button>
          </div>
        </div>
        <div class="cart-item-total">₺${(item.price * item.qty).toFixed(2).replace(".", ",")}</div>
      </div>
    `
      )
      .join("");

    cartFooter.style.display = "block";
    updatePrices();
  }
}

// ===== CHANGE QUANTITY =====
function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCart();
}

// ===== REMOVE FROM CART =====
function removeFromCart(productId) {
  const item = cart.find((i) => i.id === productId);
  cart = cart.filter((i) => i.id !== productId);
  updateCart();
  if (item) showToast(`🗑️ ${item.name} sepetten kaldırıldı.`);
}

// ===== UPDATE PRICES =====
function updatePrices() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  subtotalPrice.textContent = `₺${subtotal.toFixed(2).replace(".", ",")}`;
  deliveryFee.textContent = `₺${delivery.toFixed(2).replace(".", ",")}`;
  totalPrice.textContent = `₺${total.toFixed(2).replace(".", ",")}`;
}

// ===== CART SIDEBAR TOGGLE =====
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ===== CHECKOUT =====
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCart();
  openOrderModal();
});

// ===== ORDER MODAL =====
function openOrderModal() {
  renderOrderSummaryMini();
  orderModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  orderModal.classList.remove("open");
  document.body.style.overflow = "";
}

function renderOrderSummaryMini() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  const itemsHtml = cart
    .map(
      (item) => `
    <div class="mini-item">
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <span>₺${(item.price * item.qty).toFixed(2).replace(".", ",")}</span>
    </div>
  `
    )
    .join("");

  document.getElementById("orderSummaryMini").innerHTML = `
    <h3>📋 Sipariş Özeti</h3>
    ${itemsHtml}
    <div class="mini-item">
      <span>🚴 Teslimat</span>
      <span>₺${DELIVERY_FEE.toFixed(2).replace(".", ",")}</span>
    </div>
    <div class="mini-total">
      <span>Toplam</span>
      <span>₺${total.toFixed(2).replace(".", ",")}</span>
    </div>
  `;
}

modalCancel.addEventListener("click", () => {
  closeOrderModal();
  openCart();
});

modalConfirm.addEventListener("click", () => {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const district = document.getElementById("district").value.trim();

  if (!fullName || !phone || !address || !district) {
    showToast("⚠️ Lütfen tüm zorunlu alanları doldurun!", "warning");
    return;
  }

  // Simulate order placement
  closeOrderModal();
  setTimeout(() => {
    successModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }, 300);
});

// ===== SUCCESS MODAL =====
successClose.addEventListener("click", () => {
  successModal.classList.remove("open");
  document.body.style.overflow = "";
  cart = [];
  updateCart();
  orderForm.reset();
  showToast("🌙 Afiyet olsun! Ramazan Mübarek!");
});

// Close modals on overlay click
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) closeOrderModal();
});

successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.classList.remove("open");
    document.body.style.overflow = "";
    cart = [];
    updateCart();
    orderForm.reset();
  }
});

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "default") {
  const toast = document.createElement("div");
  toast.className = "toast";
  if (type === "warning") {
    toast.style.borderLeftColor = "#e67e22";
  }
  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ===== HERO STARS =====
function createStars() {
  const container = document.getElementById("heroStars");
  const starSymbols = ["✦", "✧", "★", "☆", "✨", "⭐", "🌟"];
  for (let i = 0; i < 30; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.fontSize = Math.random() * 1.2 + 0.5 + "rem";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    container.appendChild(star);
  }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== KEYBOARD CLOSE =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
    closeOrderModal();
    successModal.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ===== INIT =====
createStars();
renderProducts();
updateCart();
