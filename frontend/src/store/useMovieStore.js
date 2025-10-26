import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import {useAuthStore} from "./useAuthStore"; // for socket & auth user

export const useMovieStore = create((set, get) => ({
    movies: [],
    seats: [],
    selectedShow: null,
    selectedSeats: [],
    isLoading: false,

    setSelectedShow: (data) => {
        set({selectedShow: data})
    },

    getAllMovies: async () => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get("/movies"); // adjust endpoint
            set({movies: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load movies");
        } finally {
            set({isLoading: false});
        }
    },


    getSeatsByShowId: async (showId) => {
        set({isLoading: true, selectedShow: showId});
        try {
            const res = await axiosInstance.get(`/seat/${showId}`);
            set({seats: res.data.data, selectedSeats: []});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load seats");
        } finally {
            set({isLoading: false});
        }
    },


    toggleSeatSelection: (seatId) => {
        const {selectedSeats} = get();
        if (selectedSeats.includes(seatId)) {
            set({selectedSeats: selectedSeats.filter((id) => id !== seatId)});
        } else {
            set({selectedSeats: [...selectedSeats, seatId]});
        }
    },


    lockSeats: async () => {
        const {selectedSeats, selectedShow} = get();
        if (!selectedSeats.length) {
            return toast.error("Please select seats first");
        }

        try {
            const res = await axiosInstance.post("/seat/lock", {
                showId: selectedShow,
                seatIds: selectedSeats,
            });

            toast.success("Seats locked successfully");
            set({seats: res.data.data.seats});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to lock seats");
        }
    },


    unlockSeats: async () => {
        const {selectedSeats, selectedShow} = get();
        if (!selectedSeats.length) {
            return toast.error("No seats selected to unlock");
        }

        try {
            const res = await axiosInstance.post("/seats/unlock", {
                showId: selectedShow,
                seatIds: selectedSeats,
            });

            toast.success("Seats unlocked successfully");
            set({seats: res.data.data?.seats || []});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unlock seats");
        }
    },


    subscribeToSeatUpdates: () => {
        const socket = useAuthStore.getState().socket;
        const {selectedShow} = get();

        if (!socket || !selectedShow) return;

        const handleSeatUpdate = (data) => {
            console.log("🎥 Real-time seat update:", data);
            set({seats: data.seats});
        };

        socket.on("seatUpdateAll", handleSeatUpdate);

        return () => socket.off("seatUpdateAll", handleSeatUpdate);
    },


    resetSeatStore: () => {
        set({
            movies: [],
            seats: [],
            selectedShow: null,
            selectedSeats: [],
            isLoading: false,
        });
    },
}));
