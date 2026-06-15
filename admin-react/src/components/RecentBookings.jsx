import { useState } from "react";
import PropTypes from "prop-types";
import BookingDetailModal from "./BookingDetailModal";
import Swal from "sweetalert2";

const getStatusStyle = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "cancel":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export default function RecentBookings({
  bookings = [],
  title = "Recent Bookings",
  onStatusUpdated,
}) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const handleUpdateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: "Update Status?",
      text: "Status booking akan diperbarui.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal update status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mt-6 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">{title}</h2>

      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="text-left border-b bg-gray-50">
            <th className="pb-3">ID</th>
            <th className="pb-3">Room</th>
            <th className="pb-3">Check In</th>
            <th className="pb-3">Check Out</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Action</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No recent bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b hover:bg-gray-50 transition-colors even:bg-gray-50/30"
              >
                <td className="py-3">{booking.id}</td>
                <td className="font-medium">Room {booking.room_id}</td>
                <td>{booking.check_in}</td>
                <td>{booking.check_out}</td>

                <td className="font-semibold text-gray-700">
                  Rp {Number(booking.total || 0).toLocaleString("id-ID")}
                </td>

                <td className="py-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm mr-2"
                  >
                    Detail
                  </button>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleUpdateStatus(booking.id, e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </td>

                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <BookingDetailModal
  booking={selectedBooking}
  onClose={() => setSelectedBooking(null)}
/>
    </div>
  );
}

RecentBookings.propTypes = {
  title: PropTypes.string,
  onStatusUpdated: PropTypes.func,
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      room_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      check_in: PropTypes.string.isRequired,
      check_out: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
