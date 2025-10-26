import React from "react";

const SelectedSeats = ({ seats, selectedSeats }) => {
  const seatNumbers = selectedSeats
    .map((id) => seats.find((s) => s._id === id)?.seatNumber)
    .filter(Boolean);

  if (!seatNumbers.length) return null;

  return (
    <div className="mt-6 text-gray-200 text-lg">
      Selected Seats:{" "}
      <span className="font-semibold text-white">{seatNumbers.join(", ")}</span>
    </div>
  );
};

export default SelectedSeats;
