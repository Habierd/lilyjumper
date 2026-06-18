'use strict';

const PRODUCTS = [
  { id: 1, name: 'PVC 4mm', level: 'basico', price: 69900, desc: 'Ligera, ideal para velocidad y técnica. Recomendable para aprendizaje y control inicial.' },
  { id: 2, name: 'PVC 5mm', level: 'tecnica', price: 69900, desc: 'Equilibrio entre control y fluidez. Perfecta para entrenar ritmo y progreso constante.' },
  { id: 3, name: 'PVC 7mm', level: 'intensa', price: 89900, desc: 'Más presencia y resistencia para entrenamientos intensos y mayor feedback al saltar.' },
  { id: 4, name: 'Segmentada', level: 'tecnica', price: 79900, desc: 'Ideal para ritmo, control y aprendizaje. Excelente sensación de manejo y precisión.' },
  { id: 5, name: 'PVC 4mm Pro', level: 'basico', price: 69900, desc: 'Versión optimizada para velocidad con agarre cómodo y cable liviano.' },
  { id: 6, name: 'PVC 5mm Flow', level: 'tecnica', price: 69900, desc: 'Balance muy fino entre velocidad y control para entrenamientos diarios.' },
  { id: 7, name: 'PVC 7mm Power', level: 'intensa', price: 89900, desc: 'Más carga visual y física. Pensada para sesiones más exigentes.' },
  { id: 8, name: 'Segmentada Pro', level: 'tecnica', price: 79900, desc: 'La mejor sensación de ritmo para quienes buscan aprender con precisión.' }
];

const WA_NUMBER = '573127839758';
let cart = loadCart();
let currentFilter = 'all';

function loadCart() {
  try { return JSON.parse(localStorage.getItem('lj_cart') || '[]'); } catch { return []; }
}
function saveCart() { localStorage.setItem('lj_cart', JSON.stringify(cart)); }
function money(n) { return '$' + n.toLocaleString('es-CO'); }
function img(id) { return `images/${id}.jpg`; }

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

function closeNav() {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderProducts();
});

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const list = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.level === currentFilter);

  grid.innerHTML = list.map(p => `
    <article class="pcard fi">
      <div class="pcard-img" onclick="openModal(${p.id})">
        <img src="${img(p.id)}" alt="${p.name}" loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;600&quot; height=&quot;600&quot; viewBox=&quot;0 0 600 600&quot;%3E%3Crect fill=&quot;%23edf4f8&quot; width=&quot;600&quot; height=&quot;600&quot;/%3E%3Ctext x=&quot;50%25&quot; y=&quot;50%25&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;middle&quot; font-size=&quot;70&quot; fill=&quot;%235aa9c1&quot;%3E%F0%9F%8C%95%3C/text%3E%3C/svg%3E'">
        <span class="pbadge b${p.level[0]}">${p.level}</span>
      </div>
      <div class="pcard-body">
        <div class="pcard-name" onclick="openModal(${p.id})">${p.name}</div>
        <div class="pcard-desc">${p.desc}</div>
        <div class="pcard-foot">
          <div class="pcard-price">${money(p.price)}<small>COP</small></div>
          <button class="btn-plus" onclick="addToCart(${p.id})" aria-label="Agregar">+</button>
        </div>
      </div>
    </article>
  `).join('');

  observeFadeIns();
}

function updateBadges() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  ['cartBadgeTop', 'cartBadgeFloat'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const found = cart.find(x => x.id === id);
  if (found) found.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateBadges();
  renderCart();
  toast(`${p.name} agregada al carrito`);
}

function changeQty(id, delta) {
  const found = cart.find(x => x.id === id);
  if (!found) return;
  found.qty += delta;
  if (found.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
  updateBadges();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateBadges();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateBadges();
  renderCart();
  toast('Carrito vaciado');
}

function cartTotal() {
  return cart.reduce((s, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
}

function buildWhatsAppText() {
  const lines = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `• ${p.name} x${item.qty} = ${money(p.price * item.qty)}`;
  }).join('\n');

  return encodeURIComponent(
`Hola Lily Jumper 🌕

Quiero finalizar esta compra:

${lines}

TOTAL: ${money(cartTotal())} COP

Quedo atento(a) para el pago y envío.`
  );
}

function renderCart() {
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!cart.length) {
    items.innerHTML = `<div class="cart-empty"><strong>Tu carrito está vacío</strong><p>Agrega una cuerda para empezar.</p></div>`;
    footer.innerHTML = '';
    return;
  }

  items.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `
      <div class="cart-item">
        <img src="${img(p.id)}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;54&quot; height=&quot;54&quot; viewBox=&quot;0 0 54 54&quot;%3E%3Crect fill=&quot;%23edf4f8&quot; width=&quot;54&quot; height=&quot;54&quot;/%3E%3Ctext x=&quot;50%25&quot; y=&quot;50%25&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;middle&quot; font-size=&quot;18&quot; fill=&quot;%235aa9c1&quot;%3E%F0%9F%8C%95%3C/text%3E%3C/svg%3E'">
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          <div class="ci-price">${money(p.price * item.qty)}</div>
        </div>
        <div class="ci-controls">
          <button class="ci-btn" onclick="changeQty(${p.id},-1)">−</button>
          <div class="ci-qty">${item.qty}</div>
          <button class="ci-btn" onclick="changeQty(${p.id},1)">+</button>
        </div>
        <button class="ci-del" onclick="removeItem(${p.id})">✕</button>
      </div>
    `;
  }).join('');

  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <strong>${money(cartTotal())} COP</strong>
    </div>
    <a class="btn-whatsapp" href="https://wa.me/${WA_NUMBER}?text=${buildWhatsAppText()}" target="_blank">Finalizar por WhatsApp</a>
    <button class="btn-secondary" onclick="clearCart()" style="width:100%;margin-top:10px">Vaciar carrito</button>
  `;
}

const sideOverlay = document.getElementById('sideOverlay');
const cartPanel = document.getElementById('cartPanel');

function openCart() {
  renderCart();
  sideOverlay.classList.add('show');
  cartPanel.classList.add('show');
  document.body.classList.add('menu-open');
}
function closeCart() {
  sideOverlay.classList.remove('show');
  cartPanel.classList.remove('show');
  document.body.classList.remove('menu-open');
}

document.getElementById('openCartTop').addEventListener('click', openCart);
document.getElementById('openCartFloating').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
sideOverlay.addEventListener('click', closeCart);

const modalOverlay = document.getElementById('modalOverlay');
document.getElementById('closeModal').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalContent').innerHTML = `
    <img src="${img(p.id)}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;1200&quot; height=&quot;600&quot; viewBox=&quot;0 0 1200 600&quot;%3E%3Crect fill=&quot;%23edf4f8&quot; width=&quot;1200&quot; height=&quot;600&quot;/%3E%3Ctext x=&quot;50%25&quot; y=&quot;50%25&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;middle&quot; font-size=&quot;80&quot; fill=&quot;%235aa9c1&quot;%3E%F0%9F%8C%95%3C/text%3E%3C/svg%3E'">
    <div class="modal-body">
      <span class="pbadge b${p.level[0]}" style="display:inline-block;position:static">${p.level}</span>
      <h3>${p.name}</h3>
      <div class="modal-price">${money(p.price)} <small>COP</small></div>
      <p>${p.desc}</p>
      <div class="modal-actions">
        <button class="btn-primary" onclick="addToCart(${p.id}); closeModal();">Agregar al carrito</button>
        <button class="btn-secondary" onclick="closeModal()">Seguir viendo</button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('show');
  document.body.classList.add('menu-open');
}
function closeModal() {
  modalOverlay.classList.remove('show');
  document.body.classList.remove('menu-open');
}

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  toast('Mensaje enviado. Te responderemos pronto.');
  e.target.reset();
});

document.querySelectorAll('.value-card, .pcard, .phase-card').forEach(el => el.classList.add('fi'));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeFadeIns() {
  document.querySelectorAll('.fi:not(.on)').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateBadges();
  renderCart();
  observeFadeIns();
});