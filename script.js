// ===============================
// RIWAAYAT WEBSITE JAVASCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // MOBILE MENU
  // ===============================

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
      });
    });
  }


  // ===============================
  // HEADER SCROLL
  // ===============================

  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

  });


  // ===============================
  // MENU FILTER
  // ===============================

  const filters = document.querySelectorAll(".filter");
  const foodCards = document.querySelectorAll(".food-card");

  filters.forEach(filter => {

    filter.addEventListener("click", () => {

      filters.forEach(btn => {
        btn.classList.remove("active");
      });

      filter.classList.add("active");

      const category = filter.dataset.filter;

      foodCards.forEach(card => {

        if (
          category === "all" ||
          card.dataset.category === category
        ) {

          card.style.display = "";

          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "";
          }, 20);

        } else {

          card.style.display = "none";

        }

      });

    });

  });


  // ===============================
  // CART
  // ===============================

  let cart = JSON.parse(
    localStorage.getItem("riwaayatCart")
  ) || [];

  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  function saveCart() {

    localStorage.setItem(
      "riwaayatCart",
      JSON.stringify(cart)
    );

  }


  function updateCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <p class="empty-cart">
          Your cart is empty.
        </p>
      `;

    } else {

      cart.forEach((item, index) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

          <div>

            <h4>${item.name}</h4>

            <p>
              ₹${item.price} × ${item.quantity}
            </p>

          </div>

          <div>

            <strong>
              ₹${item.price * item.quantity}
            </strong>

            <button
              class="remove-item"
              data-index="${index}"
            >
              Remove
            </button>

          </div>

        `;

        cartItems.appendChild(cartItem);

      });

    }


    // TOTAL ITEMS

    const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (cartCount) {
      cartCount.textContent = totalItems;
    }


    // TOTAL PRICE

    const totalPrice = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    if (cartTotal) {
      cartTotal.textContent =
        `₹${totalPrice}`;
    }


    // REMOVE ITEM

    document
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          cart.splice(index, 1);

          saveCart();

          updateCart();

        });

      });

  }


  // ===============================
  // ADD TO CART
  // ===============================

  document
    .querySelectorAll(".add-cart")
    .forEach(button => {

      button.addEventListener("click", () => {

        const name =
          button.dataset.name;

        const price =
          Number(button.dataset.price);


        const existing =
          cart.find(item =>
            item.name === name
          );


        if (existing) {

          existing.quantity++;

        } else {

          cart.push({
            name: name,
            price: price,
            quantity: 1
          });

        }


        saveCart();

        updateCart();

        showToast(
          `${name} added to cart ✓`
        );

      });

    });


  // ===============================
  // OPEN CART
  // ===============================

  function openCart() {

    cartSidebar?.classList.add("show");
    cartOverlay?.classList.add("show");

    document.body.style.overflow = "hidden";

  }


  // ===============================
  // CLOSE CART
  // ===============================

  function closeCartPanel() {

    cartSidebar?.classList.remove("show");
    cartOverlay?.classList.remove("show");

    document.body.style.overflow = "";

  }


  cartBtn?.addEventListener(
    "click",
    openCart
  );


  closeCart?.addEventListener(
    "click",
    closeCartPanel
  );


  cartOverlay?.addEventListener(
    "click",
    closeCartPanel
  );


  // ===============================
  // CHECKOUT
  // ===============================

  const checkoutBtn =
    document.getElementById("checkoutBtn");

  checkoutBtn?.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        showToast(
          "Your cart is empty!"
        );

        return;

      }

      showToast(
        "Checkout coming soon 🚀"
      );

    }
  );


  // ===============================
  // SEARCH
  // ===============================

  const searchBtn =
    document.getElementById("searchBtn");

  const searchOverlay =
    document.getElementById("searchOverlay");

  const closeSearch =
    document.getElementById("closeSearch");

  const searchInput =
    document.getElementById("searchInput");


  searchBtn?.addEventListener(
    "click",
    () => {

      searchOverlay?.classList.add("show");

      setTimeout(() => {
        searchInput?.focus();
      }, 100);

    }
  );


  closeSearch?.addEventListener(
    "click",
    () => {

      searchOverlay?.classList.remove("show");

      if (searchInput) {
        searchInput.value = "";
      }

      foodCards.forEach(card => {
        card.style.display = "";
      });

    }
  );


  // ===============================
  // SEARCH FOOD
  // ===============================

  searchInput?.addEventListener(
    "input",
    () => {

      const search =
        searchInput.value
          .toLowerCase()
          .trim();


      foodCards.forEach(card => {

        const name =
          card
            .querySelector("h3")
            ?.textContent
            .toLowerCase() || "";

        const description =
          card
            .querySelector("p")
            ?.textContent
            .toLowerCase() || "";


        if (
          name.includes(search) ||
          description.includes(search)
        ) {

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      });

    }
  );


  // ===============================
  // LOGIN MODAL
  // ===============================

  const loginBtn =
    document.getElementById("loginBtn");

  const loginModal =
    document.getElementById("loginModal");

  const closeLogin =
    document.getElementById("closeLogin");

  const loginForm =
    document.getElementById("loginForm");


  loginBtn?.addEventListener(
    "click",
    () => {

      loginModal?.classList.add("show");

      document.body.style.overflow = "hidden";

    }
  );


  closeLogin?.addEventListener(
    "click",
    () => {

      loginModal?.classList.remove("show");

      document.body.style.overflow = "";

    }
  );


  loginModal?.addEventListener(
    "click",
    event => {

      if (event.target === loginModal) {

        loginModal.classList.remove("show");

        document.body.style.overflow = "";

      }

    }
  );


  loginForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      showToast(
        "Login system coming soon 🚀"
      );

      loginModal?.classList.remove("show");

      document.body.style.overflow = "";

    }
  );


  // ===============================
  // TOAST
  // ===============================

  const toast =
    document.getElementById("toast");


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


  // ===============================
  // ESC KEY
  // ===============================

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        searchOverlay?.classList.remove("show");

        loginModal?.classList.remove("show");

        closeCartPanel();

        document.body.style.overflow = "";

      }

    }
  );


  // ===============================
  // INITIAL CART LOAD
  // ===============================

  updateCart();

});
