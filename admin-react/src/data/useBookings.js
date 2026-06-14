import { useCallback, useEffect, useState } from "react";

export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/api/admin/bookings");

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("ERROR FETCH BOOKINGS:", error);
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void fetchBookings();
}, [fetchBookings]);

  return { bookings, loading, fetchBookings };
}