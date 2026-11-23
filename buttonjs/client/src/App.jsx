import React, { useState } from 'react'

function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Vite берет адрес бэкенда из переменной окружения VITE_API_URL, а локально использует localhost:3001
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email");
      setStatus("error");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/send-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "An error occurred");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch (_) {
      setStatus("error");
      setError("Could not connect to the server");
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <form id="hero-form" onSubmit={handleSubmit} className="w-full max-w-[480px] mt-2">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <label htmlFor="hero-email-input" className="sr-only">
            Ваш email
          </label>
          
          <input
            id="hero-email-input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            data-i18n-placeholder="ph_email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="w-full sm:flex-1 bg-[#100f21] border border-dark-border focus:border-accent focus:shadow-[0_0_12px_rgba(61,255,156,0.2)] text-base sm:text-sm rounded-xl px-5 py-3.5 outline-none transition-all text-white placeholder-[#545375]"
            required
          />

          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="w-full sm:w-auto bg-accent hover:bg-[#2ce08a] text-dark-main shadow-[0_0_20px_rgba(61,255,156,0.3)] text-xs font-extrabold uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50"
            data-i18n="btn_waitlist"
          >
            {status === "loading" ? "JOINING..." : "JOIN THE WAITLIST"}
          </button>
        </div>

        {/* Сообщения о статусе отправки под формой */}
        {status === "success" && (
          <div className="form-status text-xs mt-2 w-full text-left text-green-400">
            You have been successfully added to the waitlist!
          </div>
        )}
        {status === "error" && (
          <div className="form-status text-xs mt-2 w-full text-left text-red-400">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default App;