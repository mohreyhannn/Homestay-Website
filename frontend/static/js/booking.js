// ======================
// AMBIL PARAMETER
// ======================
const params = new URLSearchParams(window.location.search);
const kamar = params.get("kamar");

if (!kamar) {
  alert("Kamar tidak ditemukan!");
  window.location.href = "/";
}

// ======================
// ELEMENT
// ======================
const btnKembali = document.getElementById("btnKembali");
const namaEl = document.getElementById("namaKamar");
const hargaEl = document.getElementById("hargaKamar");
const tanggal = document.getElementById("tanggal");
const totalMalam = document.getElementById("totalMalam");
const totalHarga = document.getElementById("totalHarga");
const btnPesan = document.getElementById("btnPesan");

let kamarData = null;
let hargaPerMalam = 0;

if (btnPesan) btnPesan.disabled = true;

if (btnKembali) {
  btnKembali.href = `/detail-kamar?kamar=${kamar}`;
}

// ======================
// TOAST FALLBACK
// ======================
function notify(message, type = "success") {
  if (typeof showToast === "function") {
    showToast(message, type);
  } else {
    alert(message);
  }
}

// ======================
// LOAD ROOM DETAIL
// ======================
async function loadRoomDetail() {
  try {
    const res = await fetch(`/api/rooms/${kamar}`);

    if (!res.ok) {
      throw new Error("Room tidak ditemukan");
    }

    kamarData = await res.json();

    hargaPerMalam = Number(kamarData.harga || 0);

    if (namaEl) namaEl.innerText = kamarData.nama_kamar;

    if (hargaEl) {
      hargaEl.innerText =
        "Rp " + hargaPerMalam.toLocaleString("id-ID");
    }

    const sumKamar = document.getElementById("sumKamar");
    if (sumKamar) sumKamar.innerText = kamarData.nama_kamar;

    await initCalendar();
  } catch (error) {
    console.error(error);
    notify("Data kamar gagal dimuat", "error");
    window.location.href = "/";
  }
}

// ======================
// MODAL BOOKING
// ======================
function showBookingModal(detailHTML, onConfirm) {
  const modal = document.createElement("div");
  modal.className = "booking-modal-overlay";

  modal.innerHTML = `
    <div class="booking-modal">
      <div class="booking-modal-icon">✓</div>

      <h3>Cek Detail Pesanan</h3>
      <p class="booking-modal-subtitle">
        Pastikan data booking kamu sudah benar sebelum lanjut ke WhatsApp.
      </p>

      <div class="booking-modal-detail">
        ${detailHTML}
      </div>

      <div class="booking-modal-actions">
        <button type="button" class="booking-modal-cancel">Cek Lagi</button>
        <button type="button" class="booking-modal-confirm">Lanjut WhatsApp</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".booking-modal-cancel").addEventListener("click", () => {
    modal.remove();
  });

  modal.querySelector(".booking-modal-confirm").addEventListener("click", async () => {
    modal.remove();
    await onConfirm();
  });
}

// ======================
// FUNGSI TANGGAL
// ======================
function getTanggal() {
  if (!tanggal.value) return null;

  const dates = tanggal.value.split(" to ");
  if (dates.length < 2) return null;

  return {
    checkin: dates[0],
    checkout: dates[1],
  };
}

function hitungBooking() {
  const dataTanggal = getTanggal();

  if (!dataTanggal || !kamarData) {
    btnPesan.disabled = true;
    return;
  }

  const tglMasuk = new Date(dataTanggal.checkin);
  const tglKeluar = new Date(dataTanggal.checkout);

  if (tglKeluar <= tglMasuk) {
    notify("Tanggal checkout harus setelah check-in", "error");
    btnPesan.disabled = true;
    return;
  }

  const malam = (tglKeluar - tglMasuk) / (1000 * 60 * 60 * 24);
  const total = malam * hargaPerMalam;

  totalMalam.innerText = malam;
  totalHarga.innerText = "Rp " + total.toLocaleString("id-ID");

  document.getElementById("sumKamar").innerText = kamarData.nama_kamar;
  document.getElementById("sumTanggal").innerText =
    `${dataTanggal.checkin} - ${dataTanggal.checkout}`;
  document.getElementById("sumMalam").innerText = malam;
  document.getElementById("sumHarga").innerText =
    "Rp " + total.toLocaleString("id-ID");

  btnPesan.disabled = malam <= 0;
}

// ======================
// INIT FLATPICKR
// ======================
async function initCalendar() {
  try {
    const res = await fetch(`/api/booked/${kamar}`);
    const bookedDates = await res.json();

    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",
      disable: bookedDates,
      minDate: "today",
      onChange: hitungBooking,
      onClose: hitungBooking,
    });
  } catch (error) {
    console.warn("Gagal ambil tanggal booking:", error);

    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      onChange: hitungBooking,
      onClose: hitungBooking,
    });
  }
}

// ======================
// BUTTON PESAN
// ======================
btnPesan.addEventListener("click", function () {
  const dataTanggal = getTanggal();

  if (!kamarData) {
    notify("Data kamar belum siap", "error");
    return;
  }

  if (!dataTanggal) {
    notify("Pilih tanggal dulu", "info");
    return;
  }

  const tglMasuk = new Date(dataTanggal.checkin);
  const tglKeluar = new Date(dataTanggal.checkout);

  if (tglKeluar <= tglMasuk) {
    notify("Tanggal tidak valid", "error");
    return;
  }

  const malam = Number(totalMalam.innerText);
  const total = Number.parseInt(totalHarga.innerText.replace(/\D/g, ""), 10);

  const detailHTML = `
    <div class="booking-detail-row">
      <span>Kamar</span>
      <b>${kamarData.nama_kamar}</b>
    </div>
    <div class="booking-detail-row">
      <span>Check-in</span>
      <b>${dataTanggal.checkin}</b>
    </div>
    <div class="booking-detail-row">
      <span>Check-out</span>
      <b>${dataTanggal.checkout}</b>
    </div>
    <div class="booking-detail-row">
      <span>Total Malam</span>
      <b>${malam} malam</b>
    </div>
    <div class="booking-detail-row total">
      <span>Total Harga</span>
      <b>Rp ${total.toLocaleString("id-ID")}</b>
    </div>
  `;

  showBookingModal(detailHTML, async function () {
    btnPesan.disabled = true;
    btnPesan.innerText = "Memproses...";

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: kamar,
          check_in: dataTanggal.checkin,
          check_out: dataTanggal.checkout,
          total: total,
        }),
      });

      const result = await res.json();

      if (result.error) {
        notify(result.error, "error");
        btnPesan.disabled = false;
        btnPesan.innerText = "Konfirmasi via WhatsApp";
        return;
      }

      const message = `Halo, saya ingin booking:

Kamar: ${kamarData.nama_kamar}
Check-in: ${dataTanggal.checkin}
Check-out: ${dataTanggal.checkout}
Total malam: ${malam} malam
Total harga: Rp ${total.toLocaleString("id-ID")}
Order ID: ${result.order_id}

Mohon konfirmasi ketersediaannya.`;

      setTimeout(() => {
        const waLink = `https://wa.me/628558038659?text=${encodeURIComponent(message)}`;
        window.location.href = waLink;
      }, 800);
    } catch (error) {
      console.error(error);
      notify("Gagal booking", "error");
      btnPesan.disabled = false;
      btnPesan.innerText = "Konfirmasi via WhatsApp";
    }
  });
});

// ======================
// INIT
// ======================
loadRoomDetail();