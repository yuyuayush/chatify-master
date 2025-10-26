import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import SeatSelector from "./SeatSelector";
import { useAuthStore } from "../store/useAuthStore";

const BookingSeatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { unlockSeat } = useAuthStore();

    // Fetch show details
    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                const res = await axiosInstance.get(`/movies/${id}`);
                setShowDetails(res.data.data);
            } catch (err) {
                console.error("Error fetching show details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShowDetails();
    }, [id]);

    // Handle seat selection from SeatSelector
    const handleSeatSelection = (seats) => {
        setSelectedSeats(seats);
    };

    // Confirm booking
    const handleConfirmBooking = async () => {
        try {
            if (selectedSeats.length === 0) return alert("Please select seats first!");

            const res = await axiosInstance.post(`/booking`, {
                id,
                seats: selectedSeats,
            });

            alert("Booking successful!");
            navigate(`/booking/confirmation/${res.data.data._id}`);
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to complete booking. Try again!");
        }
    };


    const handleCancelBooking = async () => {
        try {
            await unlockSeat({ id });
            alert("Booking unsuccesfull!");
            navigate(-1);
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to complete booking. Try again!");
        }
    };

    if (loading)
        return (
            <div className="text-center text-gray-400 mt-10">
                Loading show details...
            </div>
        );

    return (
        <div className="w-full mx-auto px-6 py-10">
            {/* Show Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-gray-800 p-6 rounded-xl shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {showDetails.title}
                    </h1>
                    <p className="text-gray-300 text-sm mt-2">
                        {showDetails.description} • {showDetails.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        {new Date(showDetails?.showTime).toLocaleString()}
                    </p>
                </div>
                <div className="mt-4 md:mt-0 text-gray-200 text-lg font-semibold">
                    ₹{showDetails?.pricePerSeat || 359} / seat
                </div>
                <img
                    src={showDetails.posterImage}
                    alt={`${showDetails.title} Poster`}
                    className="w-full h-[20rem] object-cover rounded-xl shadow-md" />
            </div>

            {/* Seat Selector */}
            <SeatSelector
                showId={id}
                onSelectionChange={handleSeatSelection}
            />

            {/* Booking Summary */}
            <div className="mt-10 flex flex-col items-center">
                {selectedSeats.length > 0 ? (
                    <>
                        <h2 className="text-lg text-white font-semibold mb-2">
                            Selected Seats:
                        </h2>
                        <div className="text-gray-300 mb-4">
                            {selectedSeats.join(", ")}
                        </div>
                        <div className="text-gray-200 font-bold text-xl mb-4">
                            Total: ₹{selectedSeats.length * showDetails.pricePerSeat}
                        </div>
                        <button
                            onClick={handleConfirmBooking}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium shadow-md transition-all"
                        >
                            Confirm Booking
                        </button>
                        <button
                            onClick={handleCancelBooking}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium shadow-md transition-all"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <p className="text-gray-400">No seats selected yet.</p>
                )}
            </div>
        </div>
    );
};

export default BookingSeatPage;
