"use client";
import { useState, useEffect } from "react";
import { Booking } from "./types/booking.type";
import Link from "next/link";

const Home: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const res = await fetch("http://host.docker.internal:5000/api/bookings", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-green-100 pt-8">
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-4">
        <h1 className="text-2xl font-bold text-green-800">Bookings</h1>
        <Link
          href="/booking/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800 transition"
        >
          New Booking
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl px-4">
        {bookings.map((booking: Booking) => (
          <Link
            key={booking.id}
            href={`/booking/${booking.id}`}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-center h-60 hover:bg-gray-100 transition"
          >
            <p className="text-lg text-gray-800 text-center">
              A Booking on{" "}
              <strong>
                {new Date(booking.date).toLocaleDateString("en-GB")}
              </strong>{" "}
              starting at <strong>{booking.start_time}</strong>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
