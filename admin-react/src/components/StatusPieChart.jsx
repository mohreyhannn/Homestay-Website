import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#facc15", "#22c55e", "#ef4444"];

export default function StatusPieChart({ data }) {
  // 🔥 tambahin warna langsung ke data
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-bold mb-4">Booking Status</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={coloredData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

StatusPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};