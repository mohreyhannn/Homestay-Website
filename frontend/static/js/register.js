const registerForm = document.getElementById("registerForm");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.innerHTML = isPassword
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nama, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
  Swal.fire({
    icon: "error",
    title: "Register Gagal",
    text: data.error || "Register gagal",
    confirmButtonColor: "#2563eb",
  });
  return;
}

Swal.fire({
  icon: "success",
  title: "Registrasi Berhasil",
  text: "Akun berhasil dibuat, silakan login",
  timer: 2000,
  showConfirmButton: false,
});

Swal.fire({
  icon: "warning",
  title: "Email Sudah Digunakan",
  text: "Silakan gunakan email lain atau login menggunakan akun tersebut.",
  confirmButtonColor: "#2563eb",
});

setTimeout(() => {
  window.location.href = "/login";
}, 2000);
  } catch (error) {
    console.error(error);
  }
});