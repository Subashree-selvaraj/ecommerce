// script.js
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const cart = document.getElementById("cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const clearCartButton = document.getElementById("clear-cart");
    const productList = document.getElementById("product-list");
  
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Sample products
    const products = {
      all: [
        { id: "1", name: "iPhone 13", price: 999, category: "mobiles" },
        { id: "2", name: "Samsung S21", price: 899, category: "mobiles" },
        { id: "3", name: "MacBook Pro", price: 1999, category: "laptops" },
        { id: "4", name: "Dell XPS", price: 1499, category: "laptops" },
        { id: "5", name: "AirPods Pro", price: 249, category: "accessories" },
        { id: "6", name: "Smart Watch", price: 199, category: "accessories" },
      ],
      mobiles: [
        { id: "1", name: "iPhone 13", price: 999, category: "mobiles" },
        { id: "2", name: "Samsung S21", price: 899, category: "mobiles" },
      ],
      laptops: [
        { id: "3", name: "MacBook Pro", price: 1999, category: "laptops" },
        { id: "4", name: "Dell XPS", price: 1499, category: "laptops" },
      ],
      accessories: [
        { id: "5", name: "AirPods Pro", price: 249, category: "accessories" },
        { id: "6", name: "Smart Watch", price: 199, category: "accessories" },
      ],
    };
  
    // Load products based on category
    function loadProducts(category) {
      productList.innerHTML = "";
      const selectedProducts = products[category] || products.all;
      selectedProducts.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "product";
        productElement.dataset.id = product.id;
        productElement.innerHTML = `
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <button class="add-to-cart">Add to Cart</button>
        `;
        productList.appendChild(productElement);
      });
    }
  
    // Add event listeners to category links
    document.querySelectorAll("nav ul li a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        loadProducts(category);
      });
    });
  
    // Load all products by default
    loadProducts("all");
  
    // Toggle cart visibility
    cartIcon.addEventListener("click", () => {
      cart.classList.toggle("active");
    });
  
    // Add to cart functionality
    productList.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        const product = e.target.closest(".product");
        const productId = product.dataset.id;
        const productName = product.querySelector("h3").innerText;
        const productPrice = parseFloat(product.querySelector("p").innerText.replace("$", ""));
        addToCart(productId, productName, productPrice);
      }
    });
  
    // Add item to cart
    function addToCart(id, name, price) {
      const existingItem = cartItems.find((item) => item.id === id);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ id, name, price, quantity: 1 });
      }
  
      updateCart();
    }
  
    // Update cart UI and localStorage
    function updateCart() {
      cartItemsContainer.innerHTML = "";
      let total = 0;
  
      cartItems.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
          <div>
            <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            <button onclick="removeItem('${item.id}')">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
      });
  
      cartTotal.innerText = total.toFixed(2);
      cartCount.innerText = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  
    // Update item quantity
    window.updateQuantity = (id, quantity) => {
      const item = cartItems.find((item) => item.id === id);
  
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          cartItems = cartItems.filter((item) => item.id !== id);
        }
      }
  
      updateCart();
    };
  
    // Remove item from cart
    window.removeItem = (id) => {
      cartItems = cartItems.filter((item) => item.id !== id);
      updateCart();
    };
  
    // Clear cart
    clearCartButton.addEventListener("click", () => {
      cartItems = [];
      updateCart();
    });
  
    // Initialize cart on page load
    updateCart();
  });