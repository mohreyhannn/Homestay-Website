import PropTypes from "prop-types";

export default function FilterBar({ filter, setFilter, selectedDate, setSelectedDate }) {
  const filters = ["today", "month", "year"];
  const formatDateValue = () => {
  const date = new Date(selectedDate);

  if (filter === "today") {
    return date.toISOString().split("T")[0];
  }

  if (filter === "month") {
    return date.toISOString().slice(0, 7);
  }

  if (filter === "year") {
    return String(date.getFullYear());
  }

  return "";
};

const handleDateChange = (e) => {
  const value = e.target.value;

  if (filter === "today") {
    setSelectedDate(new Date(value));
  }

  if (filter === "month") {
    setSelectedDate(new Date(`${value}-01`));
  }

  if (filter === "year") {
    setSelectedDate(new Date(`${value}-01-01`));
  }
};

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => setFilter(item)}
          className={`px-4 py-2 rounded-xl font-medium capitalize transition-all duration-300 ${
            filter === item
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-700 shadow hover:bg-slate-100"
          }`}
        >
          {item}
        </button>
      ))}
      {filter === "today" && (
  <input
    type="date"
    value={formatDateValue()}
    onChange={handleDateChange}
    className="px-4 py-2 rounded-xl bg-white text-sm outline-none"
  />
)}

{filter === "month" && (
  <input
    type="month"
    value={formatDateValue()}
    onChange={handleDateChange}
    className="px-4 py-2 rounded-xl bg-white text-sm outline-none"
  />
)}

{filter === "year" && (
  <input
    type="number"
    value={formatDateValue()}
    onChange={handleDateChange}
    className="px-4 py-2 rounded-xl bg-white text-sm outline-none w-28"
  />
)}
    </div>
  );
}

FilterBar.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
};