"use client";

import { useState } from "react";
import { Booking } from "../../types/booking.type";
import { useRouter } from "next/navigation";

const minLength = 3;

const NewBooking: React.FC = () => {
  const [formData, setFormData] = useState<Booking>({
    service: "",
    doctor_name: "",
    start_time: "",
    end_time: "",
    date: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.service) newErrors.service = "Service is required";
    if (!formData.doctor_name)
      newErrors.doctor_name = "Doctor's name is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.date) newErrors.date = "Date is required";

    if (formData.start_time && formData.end_time) {
      const startMinutes = timeToMinutes(formData.start_time);
      const endMinutes = timeToMinutes(formData.end_time);
      if (endMinutes <= startMinutes) {
        newErrors.end_time = "End time must be later than start time";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await fetch("http://host.docker.internal:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Failed to create booking. Please try again.");
      }

      setFormData({
        service: "",
        doctor_name: "",
        start_time: "",
        end_time: "",
        date: "",
      });
      setErrors({});
      router.push("/");
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-green-800">New Booking</h1>

        {serverError && (
          <div className="text-red-500 text-center mb-4">{serverError}</div>
        )}

        <div>
          <label className="block font-medium mb-1" htmlFor="service">
            Service
          </label>
          <input
            minLength={minLength}
            id="service"
            name="service"
            type="text"
            value={formData.service}
            onChange={handleChange}
            placeholder="service"
            className={`w-full p-2 border ${
              errors.service ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.service && (
            <p className="text-red-500 text-sm">{errors.service}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="doctor_name">
            Doctor Name
          </label>
          <input
            minLength={minLength}
            id="doctor_name"
            name="doctor_name"
            type="text"
            value={formData.doctor_name}
            onChange={handleChange}
            placeholder="doctor name"
            className={`w-full p-2 border ${
              errors.doctor_name ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.doctor_name && (
            <p className="text-red-500 text-sm">{errors.doctor_name}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="start_time">
            Start Time
          </label>
          <input
            id="start_time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.start_time ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.start_time && (
            <p className="text-red-500 text-sm">{errors.start_time}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="end_time">
            End Time
          </label>
          <input
            id="end_time"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.end_time ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.end_time && (
            <p className="text-red-500 text-sm">{errors.end_time}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.date ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewBooking;
