import PropTypes from "prop-types";
import { X } from "lucide-react";

export default function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-1">Detail Booking</h2>
        <p className="text-sm text-slate-500 mb-5">Booking #{booking.id}</p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Room</span>
            <span className="font-semibold">Room {booking.room_id}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Check In</span>
            <span>{booking.check_in}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Check Out</span>
            <span>{booking.check_out}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Status</span>
            <span className="font-semibold capitalize">{booking.status}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500">Total</span>
            <span className="font-bold">
              Rp {Number(booking.total || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Dibuat</span>
            <span>{booking.created_at || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

BookingDetailModal.propTypes = {
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};