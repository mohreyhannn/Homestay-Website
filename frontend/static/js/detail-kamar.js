// ======================
// AMBIL PARAMETER KAMAR
// ======================
const params = new URLSearchParams(globalThis.location.search);
const kamar = params.get("kamar");

if (!kamar) {
  alert("Kamar tidak ditemukan!");
  globalThis.location.href = "/";
}

// ======================
// DATA KAMAR
// ======================
const data = {
  standard: {
    nama: "Kamar Standard",
    harga: "Rp 250.000",
    gambar: "/static/images/kamar1.jpeg",
    fasilitas: ["WiFi Gratis", "AC", "Kamar Mandi", "TV"]
  },
  "1kamar": {
    nama: "Kamar 1 Bedroom",
    harga: "Rp 300.000",
    gambar: "/static/images/kamar2.jpeg",
    fasilitas: ["WiFi Gratis", "AC", "TV", "Air Panas", "Parkir"]
  },
  "2kamar": {
    nama: "Kamar 2 Bedroom",
    harga: "Rp 350.000",
    gambar: "/static/images/kamar3.jpeg",
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

let selectedRoomRating = 0;

const roomReviewList = document.getElementById("roomReviewList");
const ratingText = document.getElementById("ratingText");
const sendRoomReview = document.getElementById("sendRoomReview");
const roomReviewName = document.getElementById("roomReviewName");
const roomReviewText = document.getElementById("roomReviewText");
const roomStars = document.querySelectorAll(".room-rating-input i");

// klik bintang
roomStars.forEach((star) => {
  star.addEventListener("click", function () {
    selectedRoomRating = Number(this.dataset.value);

    roomStars.forEach((s) => {
      const value = Number(s.dataset.value);
      s.classList.toggle("active", value <= selectedRoomRating);
    });
  });
});

// ======================
// MODAL CEK REVIEW
// ======================
function showRoomReviewConfirm(detailHTML, onConfirm) {
  const modal = document.createElement("div");
  modal.className = "booking-modal-overlay";

  modal.innerHTML = `
    <div class="booking-modal">
      <div class="booking-modal-icon">★</div>

      <h3>Cek Review Kamar</h3>
      <p class="booking-modal-subtitle">
        Pastikan review kamu sudah benar sebelum dikirim.
      </p>

      <div class="booking-modal-detail">
        ${detailHTML}
      </div>

      <div class="booking-modal-actions">
        <button class="booking-modal-cancel">Edit</button>
        <button class="booking-modal-confirm">Kirim</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".booking-modal-cancel").onclick = () => modal.remove();

  modal.querySelector(".booking-modal-confirm").onclick = async () => {
    modal.remove();
    await onConfirm();
  };
}

// ======================
// LOAD REVIEW
// ======================
async function loadRoomReviews() {
  try {
    const res = await fetch(`/api/room-reviews/${kamar}`);
    const reviews = await res.json();

    reviews.forEach((r) => {
  const card = document.createElement("div");
  card.className = "review-card";

  card.innerHTML = `
    <div class="review-header">
      <div class="avatar">${r.nama.charAt(0).toUpperCase()}</div>
      <div>
        <b>${r.nama}</b>
        <div class="stars">
          ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
        </div>
      </div>
    </div>
    <p>${r.isi}</p>
  `;

  roomReviewList.appendChild(card);
});
    if (reviews.length === 0) {
      ratingText.innerText = "Belum ada review";
      roomReviewList.innerHTML = `
        <div class="col-12">
          <div class="review-card">
            <p>Belum ada review.</p>
          </div>
        </div>
      `;
      return;
    }

    const avg =
      reviews.reduce((t, r) => t + Number(r.rating), 0) / reviews.length;

    ratingText.innerText = `${avg.toFixed(1)} • ${reviews.length} review`;

    reviews.forEach((r) => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="review-card">
          <div class="review-header">
            <div class="avatar">${r.nama.charAt(0).toUpperCase()}</div>
            <div>
              <b>${r.nama}</b>
              <div class="stars">
                ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
              </div>
            </div>
          </div>
          <p>${r.isi}</p>
        </div>
      `;

      roomReviewList.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    showToast("Gagal load review", "error");
  }
}

// ======================
// AUTO HEIGHT TEXTAREA
// ======================

const textarea = document.getElementById("roomReviewText");

if (textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
}

// ======================
// SUBMIT REVIEW
// ======================
if (sendRoomReview) {
  sendRoomReview.addEventListener("click", async function () {
    const nama = roomReviewName.value.trim();
    const isi = roomReviewText.value.trim();

    if (!nama || !isi || selectedRoomRating === 0) {
      showToast("Isi nama, review, dan rating", "info");
      return;
    }

    const detailHTML = `
      <div class="booking-detail-row">
        <span>Kamar</span>
        <b>${kamarData.nama}</b>
      </div>
      <div class="booking-detail-row">
        <span>Nama</span>
        <b>${nama}</b>
      </div>
      <div class="booking-detail-row">
        <span>Rating</span>
        <b>${"★".repeat(selectedRoomRating)}${"☆".repeat(5 - selectedRoomRating)}</b>
      </div>
      <div class="booking-detail-row total">
        <span>Review</span>
        <b>${isi}</b>
      </div>
    `;

    showRoomReviewConfirm(detailHTML, async function () {
      try {
        const res = await fetch("/api/room-reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            room_id: kamar,
            nama,
            isi,
            rating: selectedRoomRating
          })
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.error || "Gagal kirim review", "error");
          return;
        }

        roomReviewName.value = "";
        roomReviewText.value = "";
        selectedRoomRating = 0;

        roomStars.forEach((s) => s.classList.remove("active"));

        await loadRoomReviews();

        showToast("Review berhasil dikirim", "success");

      } catch (err) {
        console.error(err);
        showToast("Terjadi error", "error");
      }
    });
  });
}

loadRoomReviews();

// ======================
// AUTO SCROLL REVIEW
// ======================

function autoScrollReviews() {
  const container = document.getElementById("roomReviewList");

  if (!container) return;

  let scrollAmount = 0;

  setInterval(() => {
    scrollAmount += 320;

    if (
      scrollAmount >=
      container.scrollWidth - container.clientWidth
    ) {
      scrollAmount = 0;
    }

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
  }, 3000);
}

// jalankan setelah review load
setTimeout(() => {
  autoScrollReviews();
}, 1000);

// ======================
// BUTTON BOOKING
// ======================
document.getElementById("btnBooking").addEventListener("click", function () {
 globalThis.location.href = `/booking?kamar=${kamar}`;
});