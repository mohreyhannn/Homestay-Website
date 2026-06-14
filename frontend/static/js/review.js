let rating = 0;

const btn = document.getElementById("kirimReview");
const textarea = document.getElementById("isiReview");
const stars = document.querySelectorAll(".rating-input i");


// mapping nama kamar (biar tampil bagus)
const roomNames = {
  standard: "Kamar Standard",
  "1kamar": "Kamar 1 Bedroom",
  "2kamar": "Kamar 2 Bedroom"
};

// ======================
// AUTO RESIZE TEXTAREA
// ======================
if (textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
}

// ======================
// PILIH RATING
// ======================
stars.forEach((star) => {
  star.addEventListener("click", function () {
    rating = parseInt(this.dataset.value);

    stars.forEach((s, index) => {
      if (index < rating) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  });
});

function showReviewConfirm(detailHTML, onConfirm) {
  const modal = document.createElement("div");
  modal.className = "booking-modal-overlay";

  modal.innerHTML = `
    <div class="booking-modal">
      <div class="booking-modal-icon">✓</div>

      <h3>Cek Tanggapan</h3>
      <p class="booking-modal-subtitle">
        Pastikan nama, isi tanggapan, dan rating sudah benar sebelum dikirim.
      </p>

      <div class="booking-modal-detail">
        ${detailHTML}
      </div>

      <div class="booking-modal-actions">
        <button type="button" class="booking-modal-cancel">Edit Lagi</button>
        <button type="button" class="booking-modal-confirm">Kirim Tanggapan</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".booking-modal-cancel").onclick = () => {
    modal.remove();
  };

  modal.querySelector(".booking-modal-confirm").onclick = async () => {
    modal.remove();
    await onConfirm();
  };
}

// ======================
// KIRIM REVIEW GLOBAL
// ======================
if (btn) {
  btn.addEventListener("click", async function () {
    const nama = document.getElementById("namaReview").value.trim();
    const isi = document.getElementById("isiReview").value.trim();

    if (!nama || !isi || rating === 0) {
      showToast("Isi nama, tanggapan, dan rating dulu", "info");
      return;
    }

    const detailHTML = `
      <div class="booking-detail-row">
        <span>Nama</span>
        <b>${nama}</b>
      </div>
      <div class="booking-detail-row">
        <span>Rating</span>
        <b>${"★".repeat(rating)}${"☆".repeat(5 - rating)}</b>
      </div>
      <div class="booking-detail-row total">
        <span>Tanggapan</span>
        <b>${isi}</b>
      </div>
    `;

    showReviewConfirm(detailHTML, async function () {
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nama,
            isi,
            rating
          })
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.error || "Gagal kirim review", "error");
          return;
        }

        document.getElementById("namaReview").value = "";
        document.getElementById("isiReview").value = "";
        rating = 0;

        stars.forEach((s) => s.classList.remove("active"));

        await loadReviews();

        showToast("Tanggapan berhasil dikirim", "success");

      } catch (err) {
        console.error(err);
        showToast("Terjadi error saat mengirim review", "error");
      }
    });
  });
}

// ======================
// LOAD REVIEW (GLOBAL + ROOM)
// ======================
async function loadReviews() {
  try {
    const res = await fetch("/api/reviews");
    const reviews = await res.json();

    const slider = document.getElementById("testimonialSlider");
    if (!slider) return;

    slider.innerHTML = "";

    if (reviews.length === 0) {
      slider.innerHTML = `<p style="color:white;">Belum ada tanggapan</p>`;
      return;
    }

    reviews.forEach((r) => {
      const card = document.createElement("div");
      card.classList.add("testimonial-card");

      // label kamar kalau ada
      let roomLabel = "";
      if (r.room_id) {
        const roomName = roomNames[r.room_id] || r.room_id;
        roomLabel = `<small style="color:#aaa">Review kamar: ${roomName}</small>`;
      }

      card.innerHTML = `
        <div class="testimonial-header">
          <div class="avatar">${r.nama.charAt(0).toUpperCase()}</div>
          <div>
            <h5>${r.nama}</h5>
            <div class="stars">
              ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
            </div>
            ${roomLabel}
          </div>
        </div>

        <p>"${r.isi}"</p>
      `;

      slider.appendChild(card);
    });

  } catch (err) {
    console.error("Gagal load review:", err);
  }
}

// ======================
// INIT
// ======================
loadReviews();