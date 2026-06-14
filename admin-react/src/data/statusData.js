export function generateStatusData(bookings) {
  const pending = bookings.filter((b) => b.status === "pending").length;
  const paid = bookings.filter((b) => b.status === "paid").length;
  const cancel = bookings.filter(
    (b) => b.status === "cancel" || b.status === "expired"
  ).length;

  return [
    { name: "Pending", value: pending },
    { name: "Deal", value: paid },
    { name: "Cancel", value: cancel },
  ];
}