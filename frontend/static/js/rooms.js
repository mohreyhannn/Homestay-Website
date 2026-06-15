console.log("ROOMS JS TERPANGGIL");

const roomContainer = document.getElementById("roomContainer");

async function loadRooms() {
  try {
    const res = await fetch("/api/rooms");
    const rooms = await res.json();

    console.log("DATA ROOMS:", rooms);

    if (!roomContainer) {
      console.error("roomContainer tidak ditemukan");
      return;
    }

    if (!rooms.length) {
      roomContainer.innerHTML = `
        <div class="col-12 text-center text-muted">
          Belum ada kamar tersedia.
        </div>
      `;
      return;
    }

    const html = rooms
      .map((room) => {
        const imageName = room.gambar || "kamar1.jpeg";
        const imageUrl = `/static/images/${imageName}`;

        return `
          <div class="col-md-4 reveal active">
            <div class="kamar-card">
              <div class="kamar-img">
                <img src="${imageUrl}" alt="${room.nama_kamar}">
                <span class="badge-kamar">Available</span>
              </div>

              <div class="kamar-body">
                <h5>${room.nama_kamar}</h5>

                <p class="kamar-harga">
                  Rp ${Number(room.harga).toLocaleString("id-ID")}
                  <span>/ malam</span>
                </p>

                <a href="/detail-kamar?kamar=${room.id}" class="kamar-btn">
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    console.log("HTML ROOMS:", html);

    roomContainer.innerHTML = html;
  } catch (error) {
    console.error("Gagal mengambil data kamar:", error);
  }
}

loadRooms();