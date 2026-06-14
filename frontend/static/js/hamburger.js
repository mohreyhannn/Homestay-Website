const hamburger = document.getElementById("hamburgerBtn");

hamburger.addEventListener("click", function () {
  this.classList.toggle("active");
});

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

// buka/tutup menu
hamburgerBtn.addEventListener("click", function (e) {
  e.stopPropagation();

  mobileMenu.classList.toggle("active");
});

// klik luar menu = tutup
document.addEventListener("click", function (e) {
  const isClickInsideMenu = mobileMenu.contains(e.target);
  const isClickHamburger = hamburgerBtn.contains(e.target);

  if (!isClickInsideMenu && !isClickHamburger) {
    mobileMenu.classList.remove("active");
  }
});