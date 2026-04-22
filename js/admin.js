document.addEventListener("DOMContentLoaded", function () {

  let allData = [];

  async function loadBooking() {
    const res = await fetch("http://localhost:5000/api/admin/bookings");
    const data = await res.json();

    console.log("DATA:", data);

    allData = data;
    renderTable(data);
    updateStats(data);
  }

  function renderTable(data) {
    const table = document.getElementById("tableBooking");
    table.innerHTML = "";

    data.forEach(b => {
      const row = `
        <tr>
          <td>${b.id}</td>
          <td>${b.room_id}</td>
          <td>${b.check_in} - ${b.check_out}</td>
          <td>Rp ${b.total?.toLocaleString("id-ID")}</td>
          <td>${b.status}</td>
          <td>
            <button onclick="updateStatus(${b.id}, 'paid')">✔</button>
            <button onclick="updateStatus(${b.id}, 'cancel')">✖</button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });
  }

  function updateStats(data) {
    document.getElementById("totalBooking").innerText = data.length;
    document.getElementById("totalPending").innerText = data.filter(d => d.status === "pending").length;
    document.getElementById("totalPaid").innerText = data.filter(d => d.status === "paid").length;
    document.getElementById("totalCancel").innerText = data.filter(d => d.status === "cancel").length;
  }

  window.updateStatus = async function(id, status) {
    await fetch("http://localhost:5000/api/admin/update-status", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, status })
    });

    loadBooking();
  };

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filtered = allData.filter(b =>
      b.room_id.toLowerCase().includes(keyword) ||
      b.check_in.includes(keyword) ||
      b.check_out.includes(keyword)
    );

    renderTable(filtered);
  });

  loadBooking();

});