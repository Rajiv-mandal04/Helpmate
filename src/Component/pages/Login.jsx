import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Login Successful");
        window.location.href = "/home";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong during login!");
    } finally {
      setLoading(false);
    }
  };

  // Rain drops
  const rainDrops = Array.from({ length: 150 }).map((_, i) => (
    <div
      key={i}
      className="absolute bg-white/40 w-[2px] h-[20px] rounded animate-fall"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 1 + 0.5}s`,
        animationDelay: `${Math.random() * 2}s`,
      }}
    ></div>
  ));

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-black text-white flex justify-center items-center">
      {/* Inline CSS */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>

      {/* Rainy Glassy Background */}
      <div className="absolute w-full h-full bg-black/50 backdrop-blur-[8px] z-0">
        {rainDrops}
      </div>

      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute w-36 h-36 rounded-full bg-pink-500/40 blur-3xl top-10 left-10"
        animate={{ y: [0, 60, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-44 h-44 rounded-full bg-pink-400/40 blur-2xl bottom-20 right-10"
        animate={{ y: [0, -50, 0], x: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.02, rotate: 1 }}
        className="relative z-10 w-[460px] bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-10 shadow-lg transition-all"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-lg shadow-lg font-serif tracking-wide">
              Help
            </span>
            <span className="text-pink-600 font-serif text-3xl font-extrabold tracking-wide drop-shadow-[3px_3px_3px_rgba(0,0,0,0.4)]">
              MATE
            </span>
          </h1>
        </div>

        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-200 mb-8 text-sm tracking-wide">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-gray-100 font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm text-gray-100 font-semibold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-4 flex justify-center items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-pink-400/50 text-white text-lg font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-6 h-6" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-200 mt-8">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
