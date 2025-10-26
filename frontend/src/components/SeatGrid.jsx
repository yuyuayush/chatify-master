import React from "react";
import {Link} from "react-router";


const SeatGrid = ({groupedSeats, selectedSeats, onSeatClick}) => {
    const getSeatColor = (seat, selectedSeats) => {
        if (selectedSeats.includes(seat._id)) return "bg-green-500 text-white";
        if (seat.status === "BOOKED") return "bg-red-500 text-white";
        if (seat.status === "BLOCKED") return "bg-black-500 text-black";
        if (seat.status === "RESERVED") return "bg-blue-500 text-white";


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
        <div className="flex flex-col gap-6">
            {Object.keys(groupedSeats)
                .sort()
                .map((row) => (
                    <div key={row} className="flex items-center gap-4">
                        <span className="w-6 text-gray-300 font-medium">{row}</span>
                        <div className="grid grid-cols-10 gap-3">
                            {groupedSeats[row]
                                .sort((a, b) => a.column - b.column)
                                .map((seat) => (
                                    <button
                                        onClick={() => onSeatClick(seat)}
                                        disabled={seat.status === "BOOKED"}
                                        className={`w-10 h-10 rounded-md font-semibold text-sm transition duration-150 ${getSeatColor(
                                            seat,
                                            selectedSeats
                                        )}`}
                                    >
                                        {seat.seatNumber}
                                    </button>
                                    //         <Link key={`${seat._id}`} to={`${seat._id}`}>
                                    //
                                    //
                                    // </Link>
                                ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SeatGrid;
