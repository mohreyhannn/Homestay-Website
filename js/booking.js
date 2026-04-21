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
      minDate: "today",
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
// BUTTON PESAN
// ======================
btnPesan.addEventListener("click", async function () {
  btnPesan.disabled = true;
  btnPesan.innerText = "Mengalihkan ke WhatsApp...";

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

  const malam = Number(totalMalam.innerText);
  if (malam <= 0) {
    alert("Pilih tanggal yang benar!");
    return;
  }

  const total = Number.parseInt(
    totalHarga.innerText.replace(/\D/g, ""), 
    10
  );

  try {
    // ✅ SIMPAN KE DATABASE
    const res = await fetch("http://localhost:5000/api/booking", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        room_id: kamar,
        check_in: dataTanggal.checkin,
        check_out: dataTanggal.checkout,
        total: total
      })
    });

    const result = await res.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    // ✅ BUAT PESAN WA
    const message = `Halo, saya ingin booking:
Kamar: ${kamarData.nama}
Tanggal: ${dataTanggal.checkin} - ${dataTanggal.checkout}
Total: Rp ${total.toLocaleString("id-ID")}`;

    const waLink = `https://wa.me/628558038659?text=${encodeURIComponent(message)}`;

    // ✅ REDIRECT KE WA
    window.location.href = waLink;

  } catch (error) {
    console.error(error);
    alert("Gagal booking");
  }
});

