async function renderAuthArea(id, isMobile = false) {
  const authArea = document.getElementById(id);
  if (!authArea) return;

  try {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!res.ok || !data.logged_in) {
      authArea.innerHTML = isMobile
        ? `
          <a href="/login" class="nav-link">
            <i class="bi bi-box-arrow-in-right"></i>
            Login
          </a>
          <a href="/register" class="nav-link">
            <i class="bi bi-person-plus-fill"></i>
            Register
          </a>
        `
        : `
          <a href="/login" class="nav-link">Login</a>
          <a href="/register" class="nav-link">Register</a>
        `;
      return;
    }

    const initial = data.user.nama.charAt(0).toUpperCase();

    if (isMobile) {
      authArea.innerHTML = `
        <div class="mobile-profile">
          <div class="mobile-profile-head">
            <span class="profile-avatar">${initial}</span>
            <strong>${data.user.nama}</strong>
          </div>

          <a href="/my-bookings" class="mobile-profile-link">
            <i class="bi bi-calendar-check"></i>
            Booking Saya
          </a>

          <button type="button" class="mobile-logout" id="logoutBtn-${id}">
            <i class="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      `;
    } else {
      authArea.innerHTML = `
        <div class="profile-dropdown">
          <button class="profile-btn" id="profileBtn-${id}">
            <span class="profile-avatar">${initial}</span>
            <span class="profile-name">${data.user.nama}</span>
            <i class="bi bi-chevron-down profile-arrow"></i>
          </button>

          <div class="profile-menu" id="profileMenu-${id}">
            <a href="/my-bookings">
              <i class="bi bi-calendar-check"></i>
              Booking Saya
            </a>

            <button type="button" id="logoutBtn-${id}">
              <i class="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </div>
      `;

      const profileBtn = document.getElementById(`profileBtn-${id}`);
      const profileMenu = document.getElementById(`profileMenu-${id}`);

      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        profileMenu.classList.remove("show");
      });
    }

    document
      .getElementById(`logoutBtn-${id}`)
      .addEventListener("click", async () => {
        document.querySelector(".navbar-collapse")?.classList.remove("show");
        document.getElementById("hamburgerBtn")?.classList.remove("active");
        try {
          const result = await Swal.fire({
            icon: "question",
            title: "Logout?",
            text: "Anda yakin ingin keluar?",
            showCancelButton: true,
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
          });

          if (!result.isConfirmed) return;

          const res = await fetch("/api/logout", {
            method: "POST",
          });

          if (!res.ok) {
            throw new Error("Logout gagal");
          }

          await Swal.fire({
            icon: "success",
            title: "Logout Berhasil",
            text: "Sampai jumpa kembali",
            timer: 1300,
            showConfirmButton: false,
          });

          window.location.href = "/";
        } catch (error) {
          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Logout Gagal",
            text: "Silakan coba lagi.",
            confirmButtonColor: "#dc2626",
          });
        }
      });
  } catch (error) {
    console.error("Gagal cek login:", error);
  }
}

renderAuthArea("authArea", false);
renderAuthArea("authAreaMobile", true);
