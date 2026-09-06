/* =========================================================
   RIWAAYAT — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const body = document.body;

  // Header / Navigation
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");

  // Search
  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Menu
  const filterButtons = document.querySelectorAll(".filter-btn");
  const foodCards = document.querySelectorAll(".food-card");
  const menuGrid = document.getElementById("menuGrid");

  // Cart
  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Login
  const loginModal = document.getElementById("loginModal");
  const loginClose = document.getElementById("loginClose");
  const loginForm = document.getElementById("loginForm");

  // Location
  const locationBtn = document.getElementById("locationBtn");


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
      body.classList.toggle("no-scroll");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
        body.classList.remove("no-scroll");
      });
    });
  }


  /* =========================================================
     HEADER SCROLL EFFECT
     ========================================================= */

  const handleHeaderScroll = () => {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================================
     ACTIVE NAVIGATION
     ========================================================= */

  const sections = document.querySelectorAll("section[id]");

  const updateActiveNav = () => {

    let currentSection = "";

    sections.forEach(section => {

      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }

    });

    navLinks.forEach(link => {

      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }

    });

  };

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();


  /* =========================================================
     SEARCH OVERLAY
     ========================================================= */

  const openSearch = () => {

    if (!searchOverlay) return;

    searchOverlay.classList.add("active");
    body.classList.add("no-scroll");

    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 150);

  };

  const closeSearch = () => {

    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");
    body.classList.remove("no-scroll");

    if (searchInput) {
      searchInput.value = "";
    }

    if (searchResults) {
      searchResults.innerHTML = "";
    }

  };

  if (searchBtn) {
    searchBtn.addEventListener("click", openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }


  /* =========================================================
     SEARCH FOOD ITEMS
     ========================================================= */

  if (searchInput) {

    searchInput.addEventListener("input", () => {

      const query = searchInput.value
        .trim()
        .toLowerCase();

      if (!searchResults) return;

      searchResults.innerHTML = "";

      if (!query) return;

      const matches = Array.from(foodCards).filter(card => {

        const name = (
          card.dataset.name ||
          card.querySelector(".food-name")?.textContent ||
          ""
        ).toLowerCase();

        return name.includes(query);

      });

      if (matches.length === 0) {

        searchResults.innerHTML = `
          <div class="search-empty">
            <span>🍽️</span>
            <p>No dishes found.</p>
          </div>
        `;

        return;
      }

      matches.forEach(card => {

        const name =
          card.dataset.name ||
          card.querySelector(".food-name")?.textContent ||
          "Dish";

        const price =
          card.dataset.price ||
          card.querySelector(".food-price")?.textContent ||
          "";

        const result = document.createElement("button");

        result.className = "search-result-item";

        result.innerHTML = `
          <span>${name}</span>
          <strong>₹${price}</strong>
        `;

        result.addEventListener("click", () => {

          closeSearch();

          card.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

          card.classList.add("search-highlight");

          setTimeout(() => {
            card.classList.remove("search-highlight");
          }, 1500);

        });

        searchResults.appendChild(result);

      });

    });

  }


  /* =========================================================
     CATEGORY FILTER
     ========================================================= */

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const category = button.dataset.category;

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      foodCards.forEach(card => {

        const cardCategory = card.dataset.category;

        if (
          category === "all" ||
          category === "ALL" ||
          cardCategory === category
        ) {

          card.classList.remove("hidden");

        } else {

          card.classList.add("hidden");

        }

      });

      if (menuGrid) {
        menuGrid.classList.add("filtering");

        setTimeout(() => {
          menuGrid.classList.remove("filtering");
        }, 300);
      }

    });

  });


  /* =========================================================
     CART SYSTEM
     ========================================================= */

  let cart = [];

  try {

    const savedCart = localStorage.getItem("riwaayatCart");

    if (savedCart) {
      cart = JSON.parse(savedCart);
    }

  } catch (error) {

    console.warn("Cart could not be loaded.");

    cart = [];

  }


  const saveCart = () => {

    try {
      localStorage.setItem(
        "riwaayatCart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.warn("Cart could not be saved.");
    }

  };


  /* =========================================================
     ADD TO CART
     ========================================================= */

  const addToCart = (name, price) => {

    price = Number(price);

    if (!name || Number.isNaN(price)) return;

    const existingItem = cart.find(
      item => item.name === name
    );

    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      cart.push({
        name,
        price,
        quantity: 1
      });

    }

    saveCart();
    renderCart();
    openCart();

    showToast(`${name} added to cart`);

  };


  /* =========================================================
     QUICK ADD BUTTONS
     ========================================================= */

  document.querySelectorAll(".quick-add").forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const name = button.dataset.name;
      const price = button.dataset.price;

      addToCart(name, price);

    });

  });


  /* =========================================================
     RENDER CART
     ========================================================= */

  const renderCart = () => {

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add something delicious from our menu.</p>
        </div>
      `;

    } else {

      cart.forEach((item, index) => {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `
          <div class="cart-item-info">

            <h4>${escapeHTML(item.name)}</h4>

            <span>₹${item.price}</span>

          </div>

          <div class="cart-item-actions">

            <button
              class="qty-btn"
              data-action="decrease"
              data-index="${index}"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span class="cart-qty">
              ${item.quantity}
            </span>

            <button
              class="qty-btn"
              data-action="increase"
              data-index="${index}"
              aria-label="Increase quantity"
            >
              +
            </button>

            <button
              class="remove-item"
              data-action="remove"
              data-index="${index}"
              aria-label="Remove item"
            >
              ×
            </button>

          </div>
        `;

        cartItemsContainer.appendChild(itemElement);

      });

    }


    /* Calculate total */

    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );


    /* Calculate item count */

    const count = cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


    if (cartTotal) {
      cartTotal.textContent = `₹${total}`;
    }

    if (cartCount) {

      cartCount.textContent = count;

      if (count > 0) {
        cartCount.classList.add("has-items");
      } else {
        cartCount.classList.remove("has-items");
      }

    }

  };


  /* =========================================================
     CART QUANTITY CONTROLS
     ========================================================= */

  if (cartItemsContainer) {

    cartItemsContainer.addEventListener(
      "click",
      event => {

        const button = event.target.closest("button");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (
          Number.isNaN(index) ||
          !cart[index]
        ) {
          return;
        }


        if (action === "increase") {

          cart[index].quantity += 1;

        }


        if (action === "decrease") {

          cart[index].quantity -= 1;

          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }

        }


        if (action === "remove") {

          cart.splice(index, 1);

        }


        saveCart();
        renderCart();

      }
    );

  }


  /* =========================================================
     OPEN CART
     ========================================================= */

  const openCart = () => {

    if (!cartSidebar) return;

    cartSidebar.classList.add("active");

    if (cartOverlay) {
      cartOverlay.classList.add("active");
    }

    body.classList.add("no-scroll");

  };


  /* =========================================================
     CLOSE CART
     ========================================================= */

  const closeCartPanel = () => {

    if (!cartSidebar) return;

    cartSidebar.classList.remove("active");

    if (cartOverlay) {
      cartOverlay.classList.remove("active");
    }

    body.classList.remove("no-scroll");

  };


  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  if (closeCart) {
    closeCart.addEventListener("click", closeCartPanel);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCartPanel);
  }


  /* =========================================================
     CHECKOUT
     ========================================================= */

  if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

      if (cart.length === 0) {

        showToast("Your cart is empty.");

        return;

      }

      const total = cart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );

      showToast(
        `Checkout ready — Total ₹${total}`
      );

      /*
        REAL CHECKOUT WILL BE CONNECTED LATER
        WITH SUPABASE + PAYMENT SYSTEM.
      */

    });

  }


  /* =========================================================
     LOGIN MODAL
     ========================================================= */

  const openLogin = () => {

    if (!loginModal) return;

    loginModal.classList.add("active");
    body.classList.add("no-scroll");

  };


  const closeLogin = () => {

    if (!loginModal) return;

    loginModal.classList.remove("active");
    body.classList.remove("no-scroll");

  };


  if (loginClose) {
    loginClose.addEventListener(
      "click",
      closeLogin
    );
  }


  if (loginModal) {

    loginModal.addEventListener(
      "click",
      event => {

        if (event.target === loginModal) {
          closeLogin();
        }

      }
    );

  }


  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const email =
          document.getElementById("loginEmail")?.value;

        const password =
          document.getElementById("loginPassword")?.value;

        if (!email || !password) {

          showToast("Please fill all fields.");

          return;

        }

        /*
          Supabase Authentication will be connected
          in the next backend step.
        */

        showToast(
          "Login system will be connected with Supabase."
        );

      }
    );

  }


  /* =========================================================
     LOCATION BUTTON
     ========================================================= */

  if (locationBtn) {

    locationBtn.addEventListener(
      "click",
      () => {

        /*
          We are not inventing a restaurant address.
          Real location will be added once the
          restaurant address is finalized.
        */

        if (
          navigator.geolocation &&
          window.isSecureContext
        ) {

          navigator.geolocation.getCurrentPosition(
            position => {

              const latitude =
                position.coords.latitude;

              const longitude =
                position.coords.longitude;

              const mapsURL =
                `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

              window.open(
                mapsURL,
                "_blank"
              );

            },

            () => {

              showToast(
                "Location permission was not available."
              );

            }

          );

        } else {

          showToast(
            "Location will be available after the restaurant address is added."
          );

        }

      }
    );

  }


  /* =========================================================
     TOAST NOTIFICATION
     ========================================================= */

  function showToast(message) {

    const oldToast =
      document.querySelector(".riwaayat-toast");

    if (oldToast) {
      oldToast.remove();
    }

    const toast =
      document.createElement("div");

    toast.className = "riwaayat-toast";

    toast.innerHTML = `
      <span>✓</span>
      <p>${escapeHTML(message)}</p>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {

      toast.classList.remove("show");

      setTimeout(() => {
        toast.remove();
      }, 300);

    }, 2500);

  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================================================
     KEYBOARD ESCAPE
     ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") return;

      closeSearch();
      closeCartPanel();
      closeLogin();

      if (nav) {
        nav.classList.remove("active");
      }

      if (menuToggle) {
        menuToggle.classList.remove("active");
      }

      body.classList.remove("no-scroll");

    }
  );


  /* =========================================================
     BUTTON RIPPLE
     ========================================================= */

  document
    .querySelectorAll("button")
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          this.classList.add("clicked");

          setTimeout(() => {
            this.classList.remove("clicked");
          }, 250);

        }
      );

    });


  /* =========================================================
     INITIAL CART RENDER
     ========================================================= */

  renderCart();


  /* =========================================================
     PAGE LOADED
     ========================================================= */

  document.documentElement.classList.add(
    "js-loaded"
  );

});
