const params = new URLSearchParams(globalThis.location.search);
const kamar = params.get("kamar");

if (!kamar) {
  alert("Kamar tidak ditemukan!");
  globalThis.location.href = "/";
}

let roomData = null;

// LOAD DETAIL KAMAR
async function loadRoomDetail() {
  try {
    const res = await fetch(`/api/rooms/${kamar}`);

    if (!res.ok) {
      throw new Error("Room tidak ditemukan");
    }

    roomData = await res.json();

    document.getElementById("namaKamar").innerText = roomData.nama_kamar;

    document.getElementById("hargaKamar").innerText =
      "Rp " + Number(roomData.harga).toLocaleString("id-ID");

    document.getElementById("gambarKamar").src =
      `/static/images/${roomData.gambar || "kamar1.jpeg"}`;

    const fasilitasList = document.getElementById("fasilitasKamar");
    fasilitasList.innerHTML = "";

    const fasilitas = roomData.deskripsi
      ? roomData.deskripsi.split(",")
      : ["WiFi Gratis", "AC", "TV"];

    fasilitas.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = "✔️ " + item.trim();
      fasilitasList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert("Detail kamar gagal dimuat!");
    globalThis.location.href = "/";
  }
}

// GALERI
document.querySelectorAll(".gallery-thumb img").forEach((img) => {
  img.addEventListener("click", function () {
    document.getElementById("gambarKamar").src = this.src;
  });
});

// REVIEW
let selectedRoomRating = 0;

const roomReviewList = document.getElementById("roomReviewList");
const ratingText = document.getElementById("ratingText");
const sendRoomReview = document.getElementById("sendRoomReview");
const roomReviewName = document.getElementById("roomReviewName");
const roomReviewText = document.getElementById("roomReviewText");
const roomStars = document.querySelectorAll(".room-rating-input i");

roomStars.forEach((star) => {
  star.addEventListener("click", function () {
    selectedRoomRating = Number(this.dataset.value);

    roomStars.forEach((s) => {
      const value = Number(s.dataset.value);
      s.classList.toggle("active", value <= selectedRoomRating);
    });
  });
});

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
      <div class="booking-modal-detail">${detailHTML}</div>
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

async function loadRoomReviews() {
  try {
    const res = await fetch(`/api/room-reviews/${kamar}`);
    const reviews = await res.json();

    roomReviewList.innerHTML = "";

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
      reviews.reduce((total, r) => total + Number(r.rating), 0) /
      reviews.length;

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
  }
}

// AUTO HEIGHT TEXTAREA
const textarea = document.getElementById("roomReviewText");

if (textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
}

// SUBMIT REVIEW
if (sendRoomReview) {
  sendRoomReview.addEventListener("click", async function () {
    const nama = roomReviewName.value.trim();
    const isi = roomReviewText.value.trim();

    if (!nama || !isi || selectedRoomRating === 0) {
      alert("Isi nama, review, dan rating");
      return;
    }

    const detailHTML = `
      <div class="booking-detail-row">
        <span>Kamar</span>
        <b>${roomData?.nama_kamar || "-"}</b>
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room_id: kamar,
            nama,
            isi,
            rating: selectedRoomRating,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Gagal kirim review");
          return;
        }

        roomReviewName.value = "";
        roomReviewText.value = "";
        selectedRoomRating = 0;

        roomStars.forEach((s) => s.classList.remove("active"));

        await loadRoomReviews();

        alert("Review berhasil dikirim");
      } catch (err) {
        console.error(err);
        alert("Terjadi error");
      }
    });
  });
}

// AUTO SCROLL REVIEW
function autoScrollReviews() {
  const container = document.getElementById("roomReviewList");

  if (!container) return;

  let scrollAmount = 0;

  setInterval(() => {
    scrollAmount += 320;

    if (scrollAmount >= container.scrollWidth - container.clientWidth) {
      scrollAmount = 0;
    }

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, 3000);
}

// BUTTON BOOKING
document.getElementById("btnBooking").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.logged_in) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk melakukan booking.",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });

      return;
    }

    window.location.href = `/booking?kamar=${kamar}`;

  } catch (error) {
    console.error(error);
  }
});

// INIT
loadRoomDetail();
loadRoomReviews();

setTimeout(() => {
  autoScrollReviews();
}, 1000);