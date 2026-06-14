export function filterBookingsByDate(bookings, filter, selectedDate) {
  const targetDate = new Date(selectedDate);

  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.check_in);

    const sameDay =
      bookingDate.getDate() === targetDate.getDate() &&
      bookingDate.getMonth() === targetDate.getMonth() &&
      bookingDate.getFullYear() === targetDate.getFullYear();

    const sameMonth =
      bookingDate.getMonth() === targetDate.getMonth() &&
      bookingDate.getFullYear() === targetDate.getFullYear();

    const sameYear =
      bookingDate.getFullYear() === targetDate.getFullYear();

    if (filter === "today") return sameDay;
    if (filter === "month") return sameMonth;
    if (filter === "year") return sameYear;

    return true;
  });
}