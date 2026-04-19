// ======================
// AMBIL PARAMETER KAMAR
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
  standard: {
    nama: "Kamar Standard",
    harga: "Rp 250.000",
    gambar: "images/kamar1.jpeg",
    fasilitas: ["WiFi Gratis", "AC", "Kamar Mandi", "TV"]
  },
  "1kamar": {
    nama: "Kamar 1 Bedroom",
    harga: "Rp 300.000",
    gambar: "images/kamar2.jpeg",
    fasilitas: ["WiFi Gratis", "AC", "TV", "Air Panas", "Parkir"]
  },
  "2kamar": {
    nama: "Kamar 2 Bedroom",
    harga: "Rp 350.000",
    gambar: "images/kamar3.jpeg",
    fasilitas: ["WiFi Gratis", "AC", "TV", "Dapur"]
  }
};

const kamarData = data[kamar];

// 🔥 VALIDASI tambahan (biar gak error kalau kamar gak ada)
if (!kamarData) {
  alert("Data kamar tidak valid!");
  globalThis.location.href = "index.html";
}

// ======================
// TAMPILKAN DATA
// ======================
document.getElementById("namaKamar").innerText = kamarData.nama;
document.getElementById("hargaKamar").innerText = kamarData.harga;
document.getElementById("gambarKamar").src = kamarData.gambar;

// fasilitas
const fasilitasList = document.getElementById("fasilitasKamar");
fasilitasList.innerHTML = ""; // reset biar gak dobel

kamarData.fasilitas.forEach(f => {
  const li = document.createElement("li");
  li.textContent = "✔️ " + f; // 🔥 ganti innerHTML biar lebih aman (anti XSS)
  fasilitasList.appendChild(li);
});

// ======================
// GALERI
// ======================
document.querySelectorAll(".gallery-thumb img").forEach(img => {
  img.addEventListener("click", function () {
    document.getElementById("gambarKamar").src = this.src;
  });
});

// ======================
// REVIEW
// ======================
const btnReview = document.getElementById("kirimReview");

if (btnReview) {
  btnReview.addEventListener("click", function () {
    const nama = document.getElementById("namaReview").value.trim();
    const isi = document.getElementById("isiReview").value.trim();

    if (!nama || !isi) {
      alert("Isi nama dan review terlebih dahulu");
      return;
    }

    const reviewGrid = document.querySelector(".review-section .row");

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="review-card">
        <div class="review-header">
          <div class="avatar">${nama[0]}</div>
          <div>
            <b>${nama}</b>
            <div class="stars">★★★★★</div>
          </div>
        </div>
        <p>${isi}</p>
      </div>
    `;

    reviewGrid.appendChild(col);

    document.getElementById("namaReview").value = "";
    document.getElementById("isiReview").value = "";
  });
}

// ======================
// BUTTON BOOKING
// ======================
document.getElementById("btnBooking").addEventListener("click", function () {
  globalThis.location.href = `booking.html?kamar=${kamar}`;
});