import { Booking } from "../../types/booking.type";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const res = await fetch(
      `http://host.docker.internal:5000/api/bookings/${id}`,
      { cache: "no-store", mode: "no-cors" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch booking");
    }

    const booking = await res.json();
    return booking;
  } catch (error) {
    throw new Error("Error fetching Booking");
  }
}

const BookingDetails = async ({ params }: { params: { id: string } }) => {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-2xl font-bold mb-4 text-green-800">
        Booking Details
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <p className="text-lg text-gray-800">
          This Booking is with <strong>{booking.doctor_name}</strong> for{" "}
          <strong>{booking.service}</strong> and it ends at{" "}
          <strong>{booking.end_time}</strong>.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingDetails;
