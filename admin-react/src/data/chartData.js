export function generateMonthlyData(bookings) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((month) => ({
    month,
    bookings: 0,
    revenue: 0,
  }));

  bookings.forEach((booking) => {
    const date = new Date(booking.check_in);
    const monthIndex = date.getMonth();

    monthlyData[monthIndex].bookings += 1;

    if (booking.status === "paid") {
      monthlyData[monthIndex].revenue += booking.total;
    }
  });

  return monthlyData;
}