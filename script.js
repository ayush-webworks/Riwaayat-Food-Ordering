/* ===============================
   RIWAAYAT - SCRIPT.JS
================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ELEMENTS
  =============================== */

  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");

  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  const loginForm = document.getElementById("loginForm");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  const toast = document.getElementById("toast");

  const foodCards = document.querySelectorAll(".food-card");
  const filterButtons = document.querySelectorAll(".filter");


  /* ===============================
     CART
  =============================== */

  let cart = [];


  function updateCart() {

    if (!cartItems || !cartCount || !cartTotal) return;

    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cartTotal.textContent = `₹${total}`;


    if (cart.length === 0) {

      cartItems.innerHTML = `
        <p class="empty-cart">
          Your cart is empty.
        </p>
      `;

      return;
    }


    cartItems.innerHTML = cart.map((item, index) => {

      return `
        <div class="cart-item">

          <div class="cart-item-info">

            <h4>${item.name}</h4>

            <p>
              ₹${item.price} × ${item.quantity}
            </p>

          </div>

          <div class="cart-item-actions">

            <button
              class="quantity-btn"
              data-action="minus"
              data-index="${index}"
            >
              −
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              class="quantity-btn"
              data-action="plus"
              data-index="${index}"
            >
              +
            </button>

          </div>

          <button
            class="remove-item"
            data-index="${index}"
          >
            ✕
          </button>

        </div>
      `;

    }).join("");

  }


  function addToCart(name, price) {

    const existing = cart.find(
      item => item.name === name
    );


    if (existing) {

      existing.quantity++;

    } else {

      cart.push({
        name: name,
        price: Number(price),
        quantity: 1
      });

    }

    updateCart();
    showToast(`${name} added to cart ✓`);
  }


  /* ===============================
     ADD CART BUTTONS
  =============================== */

  document.addEventListener("click", (e) => {

    const button = e.target.closest(".add-cart");

    if (!button) return;

    const name = button.dataset.name;
    const price = button.dataset.price;

    addToCart(name, price);

  });


  /* ===============================
     CART QUANTITY
  =============================== */

  if (cartItems) {

    cartItems.addEventListener("click", (e) => {

      const quantityButton =
        e.target.closest(".quantity-btn");

      const removeButton =
        e.target.closest(".remove-item");


      if (quantityButton) {

        const index =
          Number(quantityButton.dataset.index);

        const action =
          quantityButton.dataset.action;


        if (action === "plus") {

          cart[index].quantity++;

        }

        if (action === "minus") {

          cart[index].quantity--;

          if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

          }

        }

        updateCart();

      }


      if (removeButton) {

        const index =
          Number(removeButton.dataset.index);

        cart.splice(index, 1);

        updateCart();

      }

    });

  }


  /* ===============================
     CART OPEN / CLOSE
  =============================== */

  function openCart() {

    cartSidebar?.classList.add("active");
    cartOverlay?.classList.add("active");

    document.body.classList.add("no-scroll");

  }


  function closeCartSidebar() {

    cartSidebar?.classList.remove("active");
    cartOverlay?.classList.remove("active");

    document.body.classList.remove("no-scroll");

  }


  cartBtn?.addEventListener("click", openCart);

  closeCart?.addEventListener(
    "click",
    closeCartSidebar
  );

  cartOverlay?.addEventListener(
    "click",
    closeCartSidebar
  );


  /* ===============================
     CHECKOUT
  =============================== */

  checkoutBtn?.addEventListener("click", () => {

    if (cart.length === 0) {

      showToast("Your cart is empty!");

      return;

    }


    showToast("Order checkout coming soon ✓");

  });


  /* ===============================
     SEARCH
  =============================== */

  function openSearch() {

    searchOverlay?.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {

      searchInput?.focus();

    }, 200);

  }


  function closeSearchBox() {

    searchOverlay?.classList.remove("active");

    document.body.classList.remove("no-scroll");

    if (searchInput) {

      searchInput.value = "";

    }

    foodCards.forEach(card => {

      card.style.display = "";

    });

  }


  searchBtn?.addEventListener(
    "click",
    openSearch
  );

  closeSearch?.addEventListener(
    "click",
    closeSearchBox
  );


  searchOverlay?.addEventListener(
    "click",
    (e) => {

      if (e.target === searchOverlay) {

        closeSearchBox();

      }

    }
  );


  /* ===============================
     LIVE SEARCH
  =============================== */

  searchInput?.addEventListener(
    "input",
    () => {

      const searchValue =
        searchInput.value
          .toLowerCase()
          .trim();


      foodCards.forEach(card => {

        const text =
          card.textContent.toLowerCase();


        if (
          searchValue === "" ||
          text.includes(searchValue)
        ) {

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      });

    }
  );


  /* ===============================
     CATEGORY FILTER
  =============================== */

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const filter =
        button.dataset.filter;


      filterButtons.forEach(btn => {

        btn.classList.remove("active");

      });

      button.classList.add("active");


      foodCards.forEach(card => {

        const category =
          card.dataset.category;


        if (
          filter === "all" ||
          category === filter
        ) {

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      });

    });

  });


  /* ===============================
     LOGIN MODAL
  =============================== */

  function openLogin() {

    loginModal?.classList.add("active");

    document.body.classList.add("no-scroll");

  }


  function closeLoginModal() {

    loginModal?.classList.remove("active");

    document.body.classList.remove("no-scroll");

  }


  loginBtn?.addEventListener(
    "click",
    openLogin
  );

  closeLogin?.addEventListener(
    "click",
    closeLoginModal
  );


  loginModal?.addEventListener(
    "click",
    (e) => {

      if (e.target === loginModal) {

        closeLoginModal();

      }

    }
  );


  loginForm?.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();

      showToast("Login successful ✓");

      closeLoginModal();

      loginForm.reset();

    }
  );


  /* ===============================
     MOBILE MENU
  =============================== */

  menuToggle?.addEventListener(
    "click",
    () => {

      navLinks?.classList.toggle("active");

    }
  );


  if (navLinks) {

    navLinks
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            navLinks.classList.remove(
              "active"
            );

          }
        );

      });

  }


  /* ===============================
     TOAST
  =============================== */

  let toastTimer;


  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);

  }


  /* ===============================
     HEADER SCROLL
  =============================== */

  const header =
    document.getElementById("header");


  window.addEventListener(
    "scroll",
    () => {

      if (!header) return;

      if (window.scrollY > 50) {

        header.classList.add("scrolled");

      } else {

        header.classList.remove("scrolled");

      }

    }
  );


  /* ===============================
     ESC KEY
  =============================== */

  document.addEventListener(
    "keydown",
    (e) => {

      if (e.key !== "Escape") return;

      closeSearchBox();
      closeCartSidebar();
      closeLoginModal();

    }
  );


  /* ===============================
     INITIAL CART
  =============================== */

  updateCart();

});
/* ================= MOBILE HAMBURGER MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    // Change hamburger icon
    if (navLinks.classList.contains("active")) {
      menuToggle.textContent = "✕";
    } else {
      menuToggle.textContent = "☰";
    }

  });


  // Close menu when clicking any navigation link

  navLinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.classList.remove("menu-open");

      menuToggle.textContent = "☰";

    });

  });


  // Close menu when clicking outside

  document.addEventListener("click", function (event) {

    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {

      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.classList.remove("menu-open");

      menuToggle.textContent = "☰";

    }

  });

}
