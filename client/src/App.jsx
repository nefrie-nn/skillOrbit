import React, { useState } from 'react'

function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

  // Basic client-side email format validation
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
    <section style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Join the Waitlist</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'inline-flex', gap: '8px' }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          autoComplete="email"
          required
        />
        <button type="submit" disabled={status === "loading" || !email.trim()}>
          {status === "loading" ? "Joining..." : "Join Waitlist"}
        </button>
      </form>

      {status === "success" && (
        <p style={{ color: 'green', marginTop: '1rem' }}>You have been successfully added to the waitlist!</p>
      )}
      {status === "error" && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
      )}
    </section>
  )
}

export default App;