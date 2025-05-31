import React from "react";
import { loginApi } from "@/services/authService";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function LoginCard({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPromise = loginApi(email, password);

    // Toast based on promise state
    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: (response) => {
        return `Welcome, ${response.data.user.username || "User"}!`;
      },
    });

    try {
      const response = await loginPromise;

    if (response.statusCode === 200) {
      login(response.data);
      navigate('/');
    } 
  } catch (err) {
    // Already handled by toast
  }
  };

  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white dark:bg-customDarkFg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          EduSync
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md p-3 transition cursor-pointer duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={switchToSignup}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;
