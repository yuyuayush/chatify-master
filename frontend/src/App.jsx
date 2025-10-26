import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";
import NumberSelection from "./components/NumberSection";
import MovieList from "./pages/MoviePage";
import MovieDetail from "./pages/ParticularMovie";
import PaymentSuccess from "./components/SuccessPage";
import BookingSeatPage from "./pages/BookingSeatPage";
import SeatConfirmPage from "./pages/SeatConfirmPage";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" /> */}
      {/* <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" /> */}

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />

        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:id/seat-selector" element={<BookingSeatPage />} />
        <Route path="/movies/:showId/seat-selector/:seatId" element={<SeatConfirmPage />} />
        <Route path="/success" element={<PaymentSuccess />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
