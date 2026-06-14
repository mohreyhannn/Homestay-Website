export default function Topbar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-2xl shadow-sm p-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-slate-500">
          Manage bookings, revenue, and performance
        </p>
      </div>

      <div className="text-sm text-slate-400">
        {new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
}