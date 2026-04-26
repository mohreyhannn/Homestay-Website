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