import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useBookings from "../data/useBookings";

const API_URL = "http://127.0.0.1:5000";

const getStatusStyle = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "cancel":
      return "bg-red-100 text-red-700 border border-red-300";
    case "expired":
      return "bg-gray-100 text-gray-600 border border-gray-300";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-300";
  }
};

export default function Bookings() {
  const { bookings, loading, fetchBookings } = useBookings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleUpdateStatus = async (id, status) => {
    const confirmUpdate = globalThis.confirm(
      `Ubah status booking #${id} menjadi ${status}?`
    );

    if (!confirmUpdate) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Gagal update status booking");
      }

      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Gagal update status booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      String(booking.id).includes(keyword) ||
      String(booking.room_id).toLowerCase().includes(keyword) ||
      String(booking.check_in).toLowerCase().includes(keyword) ||
      String(booking.check_out).toLowerCase().includes(keyword) ||
      String(booking.status).toLowerCase().includes(keyword);

    const matchStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Booking Management
          </h1>
          <p className="text-slate-500">
            Kelola semua data pemesanan kamar dari customer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-sm text-slate-500">Total Booking</p>
            <h2 className="text-2xl font-bold">{bookings.length}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-sm text-slate-500">Paid</p>
            <h2 className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "paid").length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-sm text-slate-500">Cancel</p>
            <h2 className="text-2xl font-bold text-red-600">
              {bookings.filter((b) => b.status === "cancel").length}
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold">Daftar Booking</h2>
              <p className="text-sm text-slate-500">
                Data booking langsung dari database Flask.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Cari booking..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancel">Cancel</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-slate-500">
                Loading bookings...
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="text-left border-b text-slate-500 bg-slate-50">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Room</th>
                    <th className="py-3 px-3">Check In</th>
                    <th className="py-3 px-3">Check Out</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-slate-500"
                      >
                        Tidak ada data booking.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-slate-50 transition"
                      >
                        <td className="py-4 px-3 font-medium">
                          #{booking.id}
                        </td>

                        <td className="py-4 px-3">
                          Room {booking.room_id}
                        </td>

                        <td className="py-4 px-3">{booking.check_in}</td>

                        <td className="py-4 px-3">{booking.check_out}</td>

                        <td className="py-4 px-3 font-semibold">
                          Rp {Number(booking.total || 0).toLocaleString("id-ID")}
                        </td>

                        <td className="py-4 px-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleUpdateStatus(booking.id, e.target.value)
                            }
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancel">Cancel</option>
                            <option value="expired">Expired</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}