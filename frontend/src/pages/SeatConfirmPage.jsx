import React, {useState, useEffect} from "react";
import {useAuthStore} from "../store/useAuthStore";
import {axiosInstance} from "../lib/axios";
import {useNavigate, useParams} from "react-router";

const SeatConfirmPage = () => {
    const {seatId, showId} = useParams(); // assuming route is /confirm/:showId
    const {socket, toggleSeat} = useAuthStore();
    const navigate = useNavigate();
    const {unlockSeat} = useAuthStore();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch seats for the show
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const res = await axiosInstance.get(`/seat/seatData/${seatId}`);
                const seatData = res.data.data;

                // Normalize: ensure it's always an array
                setSeats(Array.isArray(seatData) ? seatData : [seatData]);
            } catch (err) {
                console.error("Error fetching seats:", err);
            }
        };
        fetchSeats();
    }, [seatId]);


    // Handle real-time updates for locked/booked seats
    useEffect(() => {
        if (!socket) return;
        const eventName = `show-${seatId}`;
        socket.on(eventName, (seatId) => {
            setSeats((prev) =>
                prev.map((seat) =>
                    seat._id === seatId ? {...seat, status: "BOOKED"} : seat
                )
            );
        });
        return () => socket.off(eventName);
    }, [socket, seatId]);
    const handleCancelBooking = async () => {
        try {
            await unlockSeat({seatIds: [seatId], showId});
            navigate(-1);
        } catch (err) {
            console.error("Booking failed:", err);
        }
    };
    // Toggle seat selection
    const handleSeatClick = async (seat) => {
        if (seat.status !== "AVAILABLE") return;

        const isSelected = selectedSeats.includes(seat._id);
        const updatedSelection = isSelected
            ? selectedSeats.filter((s) => s !== seat._id)
            : [...selectedSeats, seat._id];

        setSelectedSeats(updatedSelection);
        await toggleSeat({id: seat._id, seatId});
    };

    // Calculate total price
    const totalPrice = selectedSeats.reduce((sum, id) => {
        const seat = seats.find((s) => s._id === id);
        return seat ? sum + seat.price : sum;
    }, 0);

    // Confirm booking
    const handleConfirmBooking = async () => {
        if (!selectedSeats.length) return alert("Please select at least one seat");

        try {
            setLoading(true);
            await axiosInstance.post(`/seat/book/${seatId}`, {seatIds: selectedSeats});
            alert("Seats booked successfully!");
            navigate("/"); // redirect after booking
        } catch (err) {
            console.error("Booking error:", err);
            alert("Failed to book seats. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Group seats by row
    const groupedSeats = seats.reduce((acc, seat) => {
        acc[seat.row] = acc[seat.row] || [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    return (
        <div className="flex flex-col items-center gap-6 mt-8 px-4">
            <h2 className="text-2xl font-semibold text-white mb-4">Confirm Your Seats</h2>

            {/* Screen Indicator */}
            <div
                className="bg-gradient-to-r from-gray-500 to-gray-700 w-full max-w-3xl h-4 rounded-t-md text-center text-xs text-gray-200 mb-4">
                Screen This Way
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col gap-6 w-full max-w-3xl">
                {Object.keys(groupedSeats)
                    .sort()
                    .map((row) => (
                        <div key={row} className="flex items-center gap-4">
                            <span className="w-6 text-gray-300 font-medium">{row}</span>
                            <div className="grid grid-cols-10 gap-3">
                                {groupedSeats[row]
                                    .sort((a, b) => a.column - b.column)
                                    .map((seat) => {
                                        const isSelected = selectedSeats.includes(seat._id);
                                        const seatColor =
                                            seat.status === "BOOKED"
                                                ? "bg-red-500 text-white cursor-not-allowed"
                                                : isSelected
                                                    ? "bg-green-500 text-white"
                                                    : seat.seatType === "platinum"
                                                        ? "bg-gray-300 text-black hover:bg-gray-400"
                                                        : seat.seatType === "gold"
                                                            ? "bg-amber-300 text-black hover:bg-amber-400"
                                                            : "bg-slate-400 text-black hover:bg-slate-500";

                                        return (
                                            <button
                                                key={seat._id}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.status === "BOOKED"}
                                                className={`w-10 h-10 rounded-md font-semibold text-sm transition duration-150 ${seatColor}`}
                                            >
                                                {seat.seatNumber}
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Selected Seats & Total */}
            {selectedSeats.length > 0 && (
                <div className="mt-6 text-gray-200 text-lg">
                    Selected Seats:{" "}
                    <span className="font-semibold text-white">
                        {selectedSeats
                            .map((id) => seats.find((s) => s._id === id)?.seatNumber)
                            .join(", ")}
                    </span>
                    <div className="mt-2">
                        Total Price:{" "}
                        <span className="font-semibold text-green-400">${totalPrice}</span>
                    </div>
                </div>
            )}

            {/* Confirm Button */}
            <button
                onClick={handleConfirmBooking}
                disabled={!selectedSeats.length || loading}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Booking..." : "Confirm Booking"}
            </button>
            <button
                onClick={handleCancelBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium shadow-md transition-all"
            >
                Cancel
            </button>
        </div>
    );
};

export default SeatConfirmPage;
