import { useEffect, useState } from "react";

function App() {
  const [bookings, setBookings] = useState([]);

  // ✅ pisahkan function fetch
  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    }
  };

  // ✅ useEffect aman (tidak langsung async)
  useEffect(() => {
  const loadData = async () => {
    await fetchData();
  };

  loadData();
}, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch("http://127.0.0.1:5000/api/admin/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      // refresh data setelah update
      fetchData();
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const total = bookings.length;
  const paid = bookings.filter((b) => b.status === "paid").length;
  const pending = bookings.filter((b) => b.status === "pending").length;

  const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-red-500";
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* STATISTIK */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Booking</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow">
          <p className="text-green-700">Paid</p>
          <h2 className="text-2xl font-bold">{paid}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <p className="text-yellow-700">Pending</p>
          <h2 className="text-2xl font-bold">{pending}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th>Kamar</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Total</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.id}</td>
                <td>{b.room_id}</td>
                <td>{b.check_in}</td>
                <td>{b.check_out}</td>

                <td>
  <span
    className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(b.status)}`}
  >
    {b.status}
  </span>
</td>

                <td>Rp {b.total}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => updateStatus(b.id, "paid")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Paid
                  </button>

                  <button
                    onClick={() => updateStatus(b.id, "cancel")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;