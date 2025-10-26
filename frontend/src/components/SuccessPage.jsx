import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-20 h-20 text-green-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Go to Home
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        A confirmation email will be sent to your registered email address.
      </p>
    </div>
  );
}
