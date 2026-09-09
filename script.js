document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     BASIC HELPERS
  ========================= */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const money = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };


  /* =========================
     MOBILE NAV
  ========================= */

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
    });

    $$(".main-nav a").forEach(link => {

      link.addEventListener("click", () => {
        mainNav.classList.remove("active");
      });

    });

  }


  /* =========================
     HEADER SCROLL
  ========================= */

  const header = $("#header");

  window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  });


  /* =========================
     SMOOTH SCROLL
  ========================= */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", (e) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================
     FILTERS
  ========================= */

  const filterButtons = $$(".filter-btn");
  const foodCards = $$(".food-card");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      foodCards.forEach(card => {

        const categories = card.dataset.category || "";

        if (
          filter === "all" ||
          categories.includes(filter)
        ) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }

      });

    });

  });


  /* =========================
     CART
  ========================= */

  let cart = [];

  try {
    cart = JSON.parse(
      localStorage.getItem("riwaayatCart") || "[]"
    );
  } catch {
    cart = [];
  }


  const saveCart = () => {
    localStorage.setItem(
      "riwaayatCart",
      JSON.stringify(cart)
    );
  };


  const getCartCount = () => {

    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

  };


  const getCartTotal = () => {

    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  };


  const cartCount = $("#cartCount");
  const cartItems = $("#cartItems");
  const cartTotal = $("#cartTotal");


  /* =========================
     TOAST
  ========================= */

  const toast = $("#toast");
  const toastMessage = $("#toastMessage");

  let toastTimer;

  function showToast(message) {

    if (!toast) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }


  /* =========================
     RENDER CART
  ========================= */

  function renderCart() {

    if (!cartItems) return;

    cartCount.textContent = getCartCount();

    cartTotal.textContent = money(getCartTotal());

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <div>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add something delicious from our menu.</p>
        </div>
      `;

      return;
    }


    cartItems.innerHTML = cart.map((item, index) => {

      return `
        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div class="cart-item-info">

            <h4>${item.name}</h4>

            <strong>
              ${money(item.price * item.quantity)}
            </strong>

            <div class="quantity-controls">

              <button
                class="quantity-minus"
                data-index="${index}"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="quantity-plus"
                data-index="${index}"
              >
                +
              </button>

              <button
                class="remove-item"
                data-index="${index}"
              >
                Remove
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");


    /* Quantity minus */

    $$(".quantity-minus").forEach(button => {

      button.addEventListener("click", () => {

        const index = Number(button.dataset.index);

        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }

        saveCart();
        renderCart();

      });

    });


    /* Quantity plus */

    $$(".quantity-plus").forEach(button => {

      button.addEventListener("click", () => {

        const index = Number(button.dataset.index);

        cart[index].quantity++;

        saveCart();
        renderCart();

      });

    });


    /* Remove */

    $$(".remove-item").forEach(button => {

      button.addEventListener("click", () => {

        const index = Number(button.dataset.index);

        const removed = cart[index];

        cart.splice(index, 1);

        saveCart();
        renderCart();

        showToast(`${removed.name} removed`);

      });

    });

  }


  /* =========================
     ADD TO CART
  ========================= */

  $$(".food-card").forEach(card => {

    const addButton = card.querySelector(".add-btn");

    if (!addButton) return;

    addButton.addEventListener("click", () => {

      const name = card.dataset.name;
      const price = Number(card.dataset.price);

      const image =
        card.querySelector("img")?.getAttribute("src") || "";


      const existing = cart.find(
        item => item.name === name
      );


      if (existing) {

        existing.quantity++;

      } else {

        cart.push({
          name,
          price,
          image,
          quantity: 1
        });

      }


      saveCart();
      renderCart();

      showToast(`${name} added to cart`);

    });

  });


  renderCart();


  /* =========================
     CART OPEN / CLOSE
  ========================= */

  const cartBtn = $("#cartBtn");
  const closeCart = $("#closeCart");
  const cartSidebar = $("#cartSidebar");
  const cartOverlay = $("#cartOverlay");

  function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("no-scroll");

  }


  function closeCartPanel() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");

  }


  cartBtn?.addEventListener("click", openCart);

  closeCart?.addEventListener(
    "click",
    closeCartPanel
  );

  cartOverlay?.addEventListener(
    "click",
    closeCartPanel
  );


  /* =========================
     CHECKOUT
  ========================= */

  const checkoutBtn = $("#checkoutBtn");

  checkoutBtn?.addEventListener("click", () => {

    if (cart.length === 0) {

      showToast("Your cart is empty");

      return;
    }

    showToast(
      "Checkout system will be connected soon."
    );

  });


  /* =========================
     SEARCH
  ========================= */

  const searchBtn = $("#searchBtn");
  const searchOverlay = $("#searchOverlay");
  const closeSearch = $("#closeSearch");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");


  function openSearch() {

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {
      searchInput?.focus();
    }, 200);

  }


  function closeSearchPanel() {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

  }


  searchBtn?.addEventListener(
    "click",
    openSearch
  );

  closeSearch?.addEventListener(
    "click",
    closeSearchPanel
  );


  function searchFood(query) {

    const text = query.trim().toLowerCase();

    if (!text) {

      searchResults.innerHTML = `
        <p style="color:#777">
          Start typing to search the menu...
        </p>
      `;

      return;
    }


    const matches = foodCards.filter(card => {

      const name =
        card.dataset.name.toLowerCase();

      const description =
        card.querySelector("p")?.textContent
          .toLowerCase() || "";

      return (
        name.includes(text) ||
        description.includes(text)
      );

    });


    if (matches.length === 0) {

      searchResults.innerHTML = `
        <p style="color:#777">
          No food found for "${query}".
        </p>
      `;

      return;
    }


    searchResults.innerHTML = matches.map(card => {

      return `
        <div class="search-result">

          <span>
            ${card.dataset.name}
          </span>

          <strong>
            ${money(card.dataset.price)}
          </strong>

        </div>
      `;

    }).join("");

  }


  searchInput?.addEventListener(
    "input",
    () => searchFood(searchInput.value)
  );


  /* =========================
     LOGIN
  ========================= */

  const loginBtn = $("#loginBtn");
  const loginModal = $("#loginModal");
  const closeLogin = $("#closeLogin");
  const loginForm = $("#loginForm");


  loginBtn?.addEventListener("click", () => {

    loginModal.classList.add("active");

    document.body.classList.add("no-scroll");

  });


  closeLogin?.addEventListener("click", () => {

    loginModal.classList.remove("active");

    document.body.classList.remove("no-scroll");

  });


  loginModal?.addEventListener("click", (e) => {

    if (e.target === loginModal) {

      loginModal.classList.remove("active");

      document.body.classList.remove("no-scroll");

    }

  });


  loginForm?.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = $("#email").value.trim();
    const password = $("#password").value.trim();

    if (!email || !password) {

      showToast("Please fill all fields");

      return;
    }

    loginModal.classList.remove("active");

    document.body.classList.remove("no-scroll");

    showToast("Login UI is ready!");

    loginForm.reset();

  });


  /* =========================
     LOCATION
  ========================= */

  const locationBtn = $("#locationBtn");

  locationBtn?.addEventListener("click", () => {

    if (!navigator.geolocation) {

      showToast(
        "Location is not supported by your browser."
      );

      return;
    }


    locationBtn.textContent =
      "📍 Finding location...";


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;


        const mapsUrl =
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;


        window.open(
          mapsUrl,
          "_blank"
        );


        locationBtn.textContent =
          "📍 Find My Location";

      },

      () => {

        locationBtn.textContent =
          "📍 Find My Location";

        showToast(
          "Unable to get your location."
        );

      }

    );

  });


  /* =========================
     ESCAPE KEY
  ========================= */

  document.addEventListener("keydown", (e) => {

    if (e.key !== "Escape") return;

    closeCartPanel();

    closeSearchPanel();

    loginModal?.classList.remove("active");

    document.body.classList.remove("no-scroll");

  });


});
