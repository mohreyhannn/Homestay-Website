import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export default function BookingChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-bold mb-4">Booking per Bulan</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bookings" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

BookingChart.propTypes = {
  data: PropTypes.array.isRequired,
};