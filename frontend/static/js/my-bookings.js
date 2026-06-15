const myBookingList = document.getElementById("myBookingList");

function getStatusClass(status) {
  if (status === "paid") return "status paid";
  if (status === "pending") return "status pending";
  if (status === "cancel") return "status cancel";
  if (status === "expired") return "status expired";
  return "status";
}

async function loadMyBookings() {
  try {
    const res = await fetch("/api/my-bookings");
    const bookings = await res.json();

    if (!res.ok) {
      window.location.href = "/login";
      return;
    }

    if (bookings.length === 0) {
      myBookingList.innerHTML = `
        <div class="empty">
          <h3>Belum ada booking</h3>
          <p>Silakan pilih kamar terlebih dahulu.</p>
          <a href="/#kamar">Lihat Kamar</a>
        </div>
      `;
      return;
    }

    myBookingList.innerHTML = bookings
      .map((booking) => {
        return `
          <div class="booking-item">
            <div class="booking-main">
              <div>
                <h3>${booking.room_name}</h3>
                <p>${booking.check_in} sampai ${booking.check_out}</p>
                <small>Order ID: ${booking.order_id}</small>
              </div>

              <span class="${getStatusClass(booking.status)}">
                ${booking.status}
              </span>
            </div>

            <div class="booking-footer">
              <span>Dibuat: ${booking.created_at}</span>
              <strong>Rp ${Number(booking.total || 0).toLocaleString("id-ID")}</strong>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    myBookingList.innerHTML = `
      <div class="empty">
        <h3>Gagal memuat booking</h3>
        <p>Coba refresh halaman.</p>
      </div>
    `;
  }
}

loadMyBookings();