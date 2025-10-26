import React from "react";

const SeatButton = ({ seat, isSelected, onClick }) => {
  const getSeatColor = () => {
    if (isSelected) return "bg-green-500 text-white";
    if (seat.status === "BOOKED") return "bg-red-500 text-white";
    if (seat.status === "LOCKED") return "bg-yellow-500 text-black";

    switch (seat.seatType) {
      case "platinum":
        return "bg-gray-300 text-black hover:bg-gray-400";
      case "gold":
        return "bg-amber-300 text-black hover:bg-amber-400";
      case "silver":
        return "bg-slate-400 text-black hover:bg-slate-500";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={seat.status !== "AVAILABLE"}
      className={`w-10 h-10 rounded-md font-semibold text-sm transition duration-150 ${getSeatColor()}`}
    >
      {seat.seatNumber}
    </button>
  );
};

export default SeatButton;
