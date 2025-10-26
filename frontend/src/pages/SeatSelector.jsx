import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SeatGrid from "../components/SeatGrid";
import SeatLegend from "../components/SeatLegend";
import SelectedSeats from "../components/SelectedSeats";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const SeatSelector = ({ showId }) => {
    const { socket } = useAuthStore();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const getData = async () => {
        try {
            const res = await axiosInstance.get(`/seat/${showId}`);
            setSeats(res.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load seats");
        }
    };

    // Handle seat click locally
    const handleSeatClick = (seat) => {
        if (seat.status !== "AVAILABLE") return;

        // Optimistically mark as RESERVED locally
        setSeats((prev) =>
            prev.map((s) =>
                s._id === seat._id ? { ...s, status: "RESERVED" } : s
            )
        );

        setSelectedSeats((prev) => [...prev, seat._id]);

        // Send lock request to backend
        axiosInstance.post("/seat/lock", {
            showId,
            seatIds: [seat._id],
        }).catch(() => {
            // rollback if backend fails
            setSeats((prev) =>
                prev.map((s) =>
                    s._id === seat._id ? { ...s, status: "AVAILABLE" } : s
                )
            );
            setSelectedSeats((prev) => prev.filter((id) => id !== seat._id));
        });
    };

    // Confirm seats by calling backend to lock
    const continueToBook = async () => {
        if (!selectedSeats.length) {
            return toast.error("Please select seats first");
        }

        try {
            const res = await axiosInstance.post("/seat/lock", {
                showId,
                seatIds: selectedSeats,
            });

            toast.success("Seats locked successfully");
            setSeats(res.data?.data?.seats || seats);
            setSelectedSeats([]); // reset selection after booking
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to lock seats");
        }
    };

    // Subscribe to real-time updates
    useEffect(() => {
        if (!socket || !showId) return;

        const handleSeatUpdate = (data) => {
            if (!data?.seats) return;

            // Merge server seat status with local selection
            setSeats(data.seats);

            // Keep selectedSeats only if still AVAILABLE
            setSelectedSeats((prevSelected) =>
                prevSelected.filter((id) =>
                    data.seats.find((seat) => seat._id === id && seat.status === "AVAILABLE")
                )
            );
        };

        socket.on(`show-${showId}`, handleSeatUpdate);

        return () => socket.off(`show-${showId}`, handleSeatUpdate);
    }, [socket, showId]);

    // Group seats by row for rendering
    const groupedSeats = (seats || []).reduce((acc, seat) => {
        acc[seat.row] = acc[seat.row] || [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    useEffect(() => {
        getData();
    }, [showId]);

    return (
        <div className="flex w-full flex-col items-center gap-6 mt-8">
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 w-3/4 h-4 rounded-t-md text-center text-xs text-gray-200 mb-4">
                Screen This Way
            </div>

            <SeatGrid
                groupedSeats={groupedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
            />

            <button
                className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-normal"
                onClick={continueToBook}
            >
                Confirm the Seats
            </button>

            <SeatLegend />
            <SelectedSeats seats={seats} selectedSeats={selectedSeats} />
        </div>
    );
};

export default SeatSelector;
