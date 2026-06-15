const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
      ? '<i class="bi bi-eye-slash"></i>'
      : '<i class="bi bi-eye"></i>';
  });
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: data.error || "Email atau password salah",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Berhasil",
      text: "Selamat datang kembali.",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text: "Tidak dapat terhubung ke server.",
      confirmButtonColor: "#dc2626",
    });
  }
});