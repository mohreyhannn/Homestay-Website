const navbar = document.querySelector(".custom-navbar");
const navbarLogo = document.getElementById("navbar-logo");
const navbarText = document.getElementById("navbar-text");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    // Navbar berubah saat scroll
    navbar.classList.add("scrolled");

    // Ganti logo + warna teks
    if (navbarLogo) {
      navbarLogo.src = "/static/images/logo-dark.png";
    }

    if (navbarText) {
      navbarText.style.color = "#0d6efd";
    }
  } else {
    // Navbar kembali normal
    navbar.classList.remove("scrolled");

    // Kembalikan logo + warna teks awal
    if (navbarLogo) {
      navbarLogo.src = "/static/images/logo-light.png";
    }

    if (navbarText) {
      navbarText.style.color = "white";
    }
  }
});

const navbarCollapse = document.querySelector(".navbar-collapse");
const hamburgerBtn = document.getElementById("hamburgerBtn");

if (navbarCollapse && hamburgerBtn) {
  // SOLUSI 1: klik area luar menu = menu tertutup
  document.addEventListener("click", (e) => {
    const clickedInsideMenu = navbarCollapse.contains(e.target);
    const clickedHamburger = hamburgerBtn.contains(e.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      navbarCollapse.classList.remove("show");
      hamburgerBtn.classList.remove("active");
    }
  });

  // SOLUSI 2: klik link di mobile menu = menu tertutup
  document.querySelectorAll(".mobile-menu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navbarCollapse.classList.remove("show");
      hamburgerBtn.classList.remove("active");
    });
  });
}