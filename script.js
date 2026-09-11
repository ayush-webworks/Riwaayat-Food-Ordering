/* =====================================================
   RIWAAYAT JAVASCRIPT
   ===================================================== */


/* =====================================================
   MOBILE HAMBURGER
   ===================================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    document.body.classList.toggle("no-scroll");

    if (navLinks.classList.contains("active")) {
      menuToggle.textContent = "✕";
    } else {
      menuToggle.textContent = "☰";
    }

  });


  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("active");

      document.body.classList.remove("no-scroll");

      menuToggle.textContent = "☰";

    });

  });

}


/* =====================================================
   HEADER SCROLL
   ===================================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 30) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

});


/* =====================================================
   SEARCH
   ===================================================== */

const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {
      searchInput.focus();
    }, 300);

  });

}


if (closeSearch) {

  closeSearch.addEventListener("click", closeSearchBox);

}


if (searchOverlay) {

  searchOverlay.addEventListener("click", (event) => {

    if (event.target === searchOverlay) {

      closeSearchBox();

    }

  });

}


function closeSearchBox() {

  searchOverlay.classList.remove("active");

  document.body.classList.remove("no-scroll");

  searchInput.value = "";

}


/* =====================================================
   ESC KEY
   ===================================================== */

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    closeSearchBox();

  }

});


/* =====================================================
   MENU FILTER
   ===================================================== */

const filterButtons = document.querySelectorAll(".filter");
const foodCards = document.querySelectorAll(".food-card");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    foodCards.forEach((card, index) => {

      const category = card.dataset.category;

      if (filter === "all" || category === filter) {

        card.classList.remove("hide");

        card.style.animation = "none";

        void card.offsetWidth;

        card.style.animation =
          `cardIn 0.55s ease ${index * 0.04}s both`;

      } else {

        card.classList.add("hide");

      }

    });

  });

});


/* =====================================================
   CART
   ===================================================== */

let cart = [];

const cartCount = document.getElementById("cartCount");

document.querySelectorAll(".add-cart").forEach(button => {

  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    cart.push({
      name: name,
      price: price
    });

    updateCart();

    button.textContent = "✓";

    button.style.background = "#e87513";

    setTimeout(() => {

      button.textContent = "+";

      button.style.background = "";

    }, 700);

  });

});


function updateCart() {

  if (cartCount) {

    cartCount.textContent = cart.length;

  }

}


/* =====================================================
   CART BUTTON
   ===================================================== */

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {

  cartBtn.addEventListener("click", () => {

    if (cart.length === 0) {

      alert("Your cart is empty. Add something delicious! 🍽️");

      return;

    }

    let total = cart.reduce(
      (sum, item) => sum + item.price,
      0
    );

    let items = cart
      .map(item => `${item.name} — ₹${item.price}`)
      .join("\n");

    alert(
      `RIWAAYAT CART\n\n${items}\n\nTotal: ₹${total}`
    );

  });

}


/* =====================================================
   SCROLL REVEAL
   ===================================================== */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealElements.forEach(element => {

  revealObserver.observe(element);

});


/* =====================================================
   IMAGE ERROR PROTECTION
   ===================================================== */

document.querySelectorAll("img").forEach(image => {

  image.addEventListener("error", () => {

    image.parentElement.classList.add("image-missing");

    console.warn(
      "Image not found:",
      image.getAttribute("src")
    );

  });

});


/* =====================================================
   SMOOTH CATEGORY LINK
   ===================================================== */

document.querySelectorAll('a[href="#menu"]').forEach(link => {

  link.addEventListener("click", () => {

    setTimeout(() => {

      const menu = document.getElementById("menu");

      if (menu) {

        menu.scrollIntoView({
          behavior: "smooth"
        });

      }

    }, 50);

  });

});


/* =====================================================
   LOGIN DEMO
   ===================================================== */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

  loginBtn.addEventListener("click", () => {

    alert(
      "Welcome to Riwaayat! Login system can be connected next."
    );

  });

}


/* =====================================================
   HERO PARALLAX
   ===================================================== */

const heroImage = document.querySelector(".hero-image");

window.addEventListener("scroll", () => {

  if (!heroImage) return;

  const scrollY = window.scrollY;

  if (scrollY < 700) {

    heroImage.style.transform =
      `translateY(${scrollY * 0.035}px)`;

  }

});


/* =====================================================
   FINISHED
   ===================================================== */

console.log(
  "Riwaayat website loaded successfully 🍽️"
);
