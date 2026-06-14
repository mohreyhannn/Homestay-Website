import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function SummaryCard({ title, value, icon: Icon, color, growth }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between"
    >
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-slate-800 mt-1">{value}</h2>
        <p className="text-green-500 text-sm mt-2">{growth}</p>
      </div>

      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="text-white" size={28} />
      </div>
    </motion.div>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  growth: PropTypes.string.isRequired,
};