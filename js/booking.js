// ======================
// AMBIL PARAMETER
// ======================
const params = new URLSearchParams(globalThis.location.search);
const kamar = params.get("kamar");

if (!kamar) {
  alert("Kamar tidak ditemukan!");
  globalThis.location.href = "index.html";
}

// ======================
// DATA KAMAR
// ======================
const data = {
  standard: { nama: "Kamar Standard", harga: "Rp 250.000" },
  "1kamar": { nama: "Kamar 1 Bedroom", harga: "Rp 300.000" },
  "2kamar": { nama: "Kamar 2 Bedroom", harga: "Rp 350.000" }
};

const kamarData = data[kamar];

if (!kamarData) {
  alert("Data kamar tidak valid!");
  globalThis.location.href = "index.html";
}

// ======================
// TAMPILKAN DATA
// ======================
const namaEl = document.getElementById("namaKamar");
const hargaEl = document.getElementById("hargaKamar");

if (namaEl && hargaEl) {
  namaEl.innerText = kamarData.nama;
  hargaEl.innerText = kamarData.harga;
}

// ======================
// HARGA
// ======================
const hargaPerMalam = Number.parseInt(
  kamarData.harga.replaceAll(/[^\d]/g, "")
);

// ======================
// ELEMENT
// ======================
const tanggal = document.getElementById("tanggal");
const totalMalam = document.getElementById("totalMalam");
const totalHarga = document.getElementById("totalHarga");
const btnPesan = document.getElementById("btnPesan");

// disable awal
btnPesan.disabled = true;

// ======================
// FUNGSI TANGGAL
// ======================
function getTanggal() {
  const dates = tanggal.value.split(" to ");
  if (dates.length < 2) return null;

  return {
    checkin: dates[0],
    checkout: dates[1]
  };
}

function hitungBooking() {
  const dataTanggal = getTanggal();

  if (!dataTanggal) {
    btnPesan.disabled = true;
    return;
  }

  const tglMasuk = new Date(dataTanggal.checkin);
  const tglKeluar = new Date(dataTanggal.checkout);

  if (tglKeluar <= tglMasuk) {
    alert("Tanggal checkout harus setelah checkin");
    btnPesan.disabled = true;
    return;
  }

  const malam = (tglKeluar - tglMasuk) / (1000 * 60 * 60 * 24);
  totalMalam.innerText = malam;

  const total = malam * hargaPerMalam;
  totalHarga.innerText = "Rp " + total.toLocaleString("id-ID");

  // aktifkan tombol kalau valid
  btnPesan.disabled = malam <= 0;
}

// ======================
// INIT FLATPICKR
// ======================
async function initCalendar() {
  try {
    const res = await fetch(`http://localhost:5000/api/booked/${kamar}`);
    const bookedDates = await res.json();

    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",
      disable: bookedDates,
      onChange: hitungBooking
    });

  } catch (error) {
    console.warn("Gagal ambil tanggal booking:", error);

    flatpickr("#tanggal", {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange: hitungBooking
    });
  }
}

// panggil sekali saja
initCalendar();

// ======================
// PAYMENT METHOD
// ======================
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const transferOptions = document.getElementById("transferOptions");

paymentRadios.forEach(radio => {
  radio.addEventListener("change", function () {
    transferOptions.style.display =
      this.value === "Transfer" ? "block" : "none";
  });
});

// ======================
// BUTTON PESAN
// ======================
btnPesan.addEventListener("click", async function () {
  const dataTanggal = getTanggal();

  if (!dataTanggal) {
    alert("Pilih tanggal dulu!");
    return;
  }

  const tglMasuk = new Date(dataTanggal.checkin);
  const tglKeluar = new Date(dataTanggal.checkout);

  if (tglKeluar <= tglMasuk) {
    alert("Tanggal tidak valid!");
    return;
  }

  if (totalMalam.innerText === "0") {
    alert("Pilih tanggal yang benar!");
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked');
  if (!payment) {
    alert("Pilih metode pembayaran!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/booking", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        room_id: kamar,
        check_in: dataTanggal.checkin,
        check_out: dataTanggal.checkout
      })
    });

    const result = await res.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    await pay(result.order_id);

  } catch (error) {
    console.error(error);
    alert("Gagal booking");
  }
});

// ======================
// MIDTRANS PAY
// ======================
async function pay(order_id) {
  try {
    const total = Number.parseInt(totalHarga.innerText.replace(/\D/g, ""), 10);

    const res = await fetch("http://localhost:5000/api/pay", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        order_id,
        amount: total
      })
    });

    const data = await res.json();

    snap.pay(data.token);

  } catch (error) {
    console.error(error);
    alert("Gagal memulai pembayaran");
  }
}