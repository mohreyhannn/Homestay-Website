import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SummaryCard from "../components/SummaryCard";
import BookingChart from "../components/BookingChart";
import RevenueChart from "../components/RevenueChart";
import StatusPieChart from "../components/StatusPieChart";
import RecentBookings from "../components/RecentBookings";
import useBookings from "../data/useBookings";
import { generateMonthlyData } from "../data/chartData";
import { generateStatusData } from "../data/statusData";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import { filterBookingsByDate } from "../data/filterBookings";
import { STATUS } from "../constants/status";

import {
  CalendarDays,
  Clock3,
  BadgeCheck,
  Wallet,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const [filter, setFilter] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { bookings, loading, fetchBookings } = useBookings();

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <Topbar />
          <div className="bg-white rounded-2xl shadow-md p-6 text-gray-500">
            Belum ada data booking.
          </div>
        </main>
      </div>
    );
  }

  // ✅ FILTER (tanpa month selector lagi)
  const filteredBookings = filterBookingsByDate(bookings, filter, selectedDate);

  // ✅ GROUP PER BULAN
  const groupedByMonth = filteredBookings.reduce((acc, booking) => {
    const date = new Date(booking.check_in);

    const monthKey = date.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });

    const sortKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

    if (!acc[monthKey]) {
      acc[monthKey] = {
        sortKey,
        bookings: [],
      };
    }

    acc[monthKey].bookings.push(booking);

    return acc;
  }, {});

  const sortedMonths = Object.entries(groupedByMonth).sort(
    ([, a], [, b]) => b.sortKey - a.sortKey,
  );

  // KPI
  const pendingBooking = filteredBookings.filter(
    (b) => b.status === STATUS.PENDING,
  ).length;

  const confirmedBooking = filteredBookings.filter(
    (b) => b.status === STATUS.PAID,
  ).length;

  const canceledBooking = filteredBookings.filter(
    (b) => b.status === STATUS.CANCELED,
  ).length;

  const totalRevenue = filteredBookings
    .filter((b) => b.status === STATUS.PAID)
    .reduce((sum, booking) => sum + Number(booking.total || 0), 0);

  const monthlyData = generateMonthlyData(filteredBookings);
  const statusData = generateStatusData(filteredBookings);
  const totalBooking = filteredBookings.length;

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
          <SummaryCard
            title="Total Booking"
            value={totalBooking}
            icon={CalendarDays}
            color="bg-blue-500"
          />

          <SummaryCard
            title="Pending Booking"
            value={pendingBooking}
            icon={Clock3}
            color="bg-yellow-500"
          />

          <SummaryCard
            title="Confirmed Booking"
            value={confirmedBooking}
            icon={BadgeCheck}
            color="bg-green-500"
          />

          <SummaryCard
            title="Canceled Booking"
            value={canceledBooking}
            icon={XCircle}
            color="bg-red-500"
          />

          <SummaryCard
            title="Total Revenue"
            value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
            icon={Wallet}
            color="bg-indigo-600"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-4">
            <BookingChart data={monthlyData} />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <StatusPieChart data={statusData} />
          </div>
        </section>

        <section className="mt-6 bg-white rounded-2xl shadow-md p-4">
          <RevenueChart data={monthlyData} />
        </section>

        {/* 🔥 MULTI BULAN */}
        {sortedMonths.map(([month, group]) => (
          <RecentBookings
            key={month}
            title={month}
            bookings={group.bookings}
            onStatusUpdated={fetchBookings}
          />
        ))}
      </main>
    </div>
  );
}
