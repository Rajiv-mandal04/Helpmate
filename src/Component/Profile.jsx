import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // Fetch user details
    fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Profile Error:", err));
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white text-xl font-serif">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white font-serif overflow-hidden">
      {/* ==== HEADER (HelpMate Logo) ==== */}
      <header className="flex items-center justify-between px-16 py-6 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-md">
        <div className="flex items-center space-x-3">
          <span className="bg-[#e94560] text-white px-4 py-2 rounded-lg shadow-lg text-3xl font-bold tracking-wide">
            Help
          </span>
          <span className="text-[#e94560] text-4xl font-extrabold tracking-wider drop-shadow-[3px_3px_3px_rgba(0,0,0,0.5)]">
            MATE
          </span>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="px-6 py-2 bg-[#e94560] rounded-xl text-white font-semibold text-lg shadow-lg hover:bg-[#ff4d6d] transition-all duration-300"
        >
          ⬅ Back to Home
        </button>
      </header>

      {/* ==== MAIN SECTION ==== */}
      <main className="flex items-center justify-center h-[calc(100vh-100px)] px-10">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-10 flex items-center justify-between transition-all duration-500 hover:shadow-[0_0_60px_rgba(233,69,96,0.3)]">
          {/* LEFT SIDE — Avatar & Name */}
          <div className="flex flex-col items-center w-1/3">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#e94560] to-[#ff7b9c] flex items-center justify-center text-6xl font-bold shadow-lg border-4 border-white/40">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-4xl font-bold mt-6 text-[#ffffff] drop-shadow-lg">
              {user.name}
            </h2>
            <p className="text-[#ffb6c1] mt-2 text-lg italic">
              User
            </p>
          </div>

          {/* RIGHT SIDE — Info Fields */}
          <div className="w-2/3 pl-12 space-y-6 text-lg">
            <div className="bg-white/10 p-6 rounded-xl shadow-inner border border-white/10 hover:bg-white/20 transition-all duration-300">
              <span className="block text-gray-300 font-semibold text-xl">
                Full Name
              </span>
              <p className="text-2xl text-white mt-2">{user.name}</p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl shadow-inner border border-white/10 hover:bg-white/20 transition-all duration-300">
              <span className="block text-gray-300 font-semibold text-xl">
                Email Address
              </span>
              <p className="text-2xl text-white mt-2">{user.email}</p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl shadow-inner border border-white/10 hover:bg-white/20 transition-all duration-300">
              <span className="block text-gray-300 font-semibold text-xl">
                Member Since
              </span>
              <p className="text-2xl text-white mt-2">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
