import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-bold mb-4">Revenue per Bulan</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
          <Line type="monotone" dataKey="revenue" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

RevenueChart.propTypes = {
  data: PropTypes.array.isRequired,
};