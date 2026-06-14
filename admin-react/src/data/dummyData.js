export const summaryData = {
  totalBooking: 120,
  pendingBooking: 18,
  confirmedBooking: 82,
  totalRevenue: 24500000,
};

export const monthlyData = [
  { month: "Jan", bookings: 30, revenue: 4500000 },
  { month: "Feb", bookings: 45, revenue: 6200000 },
  { month: "Mar", bookings: 50, revenue: 7000000 },
  { month: "Apr", bookings: 40, revenue: 5800000 },
  { month: "May", bookings: 60, revenue: 9000000 },
  { month: "Jun", bookings: 75, revenue: 12000000 },
  { month: "Jul", bookings: 68, revenue: 10500000 },
  { month: "Aug", bookings: 80, revenue: 13500000 },
  { month: "Sep", bookings: 72, revenue: 11800000 },
  { month: "Oct", bookings: 88, revenue: 14500000 },
  { month: "Nov", bookings: 95, revenue: 16000000 },
  { month: "Dec", bookings: 110, revenue: 21000000 },
];

export const bookingStatus = [
  { name: "pending", value: 18 },
  { name: "paid", value: 82 },
  { name: "canceled", value: 20 },
];

const dummyData = [
  {
    id: 1,
    customer: "Budi",
    room: "Deluxe Room",
    check_in: "2026-04-25",
    status: "paid",
    total: 750000,
  },
  {
    id: 2,
    customer: "Siti",
    room: "Standard Room",
    check_in: "2026-04-27",
    status: "pending",
    total: 500000,
  },
  {
    id: 3,
    customer: "Andi",
    room: "Family Room",
    check_in: "2026-04-28",
    status: "paid",
    total: 1200000,
  },
  {
    id: 4,
    customer: "Rina",
    room: "Suite Room",
    check_in: "2026-03-15",
    status: "paid",
    total: 2000000,
  },
];

export default dummyData;