import { useState, useRef, useEffect } from "react";
import { Home as HomeIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // for navigation
import SOSButton from "./Sos";
import Men from "./Men";
import Women from "./Women";
import GuardianChat from "./GuardianChat";
import Fake_Call from "./Fake_Call";

function Home() {
  const navigate = useNavigate(); // used for redirect after logout
  const [activeFeature, setActiveFeature] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Modals
  const [showMenDefence, setShowMenDefence] = useState(false);
  const [showWomenDefence, setShowWomenDefence] = useState(false);
  const [showGuardianChat, setShowGuardianChat] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);

  // Recording refs
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const scrollRef = useRef(null);

  // -------------------- Feature cards --------------------
  const features = [
    { title: "Fake Call Service", desc: "Trigger a realistic call with one tap to escape unsafe or awkward situations.", color: "from-green-400 to-lime-500", icon: "📞" },
    { title: "Voice Recording", desc: "Records silently in the background until you stop it. Keeps every word safe.", color: "from-orange-400 to-yellow-500", icon: "🎙️" },
    { title: "Women self-defence", desc: "Smart moves protect more than strength when you can’t fight.", color: "from-blue-400 to-indigo-500", icon: "👩‍🦰" },
    { title: "Men self-defence", desc: "Smart guide for men to stay alert & safe in critical moments.", color: "from-red-400 to-pink-500", icon: "👨" },
  ];

  // -------------------- Recording Logic --------------------
  const startStopRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Voice recording not supported!");
      return;
    }
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          console.log("Recording URL:", url);
          alert("Recording done! Check console for URL.");
        };

        mediaRecorder.start();
        setIsRecording(true);
        alert("Recording started!");
      } catch (err) {
        console.error(err);
        alert("Recording error!");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // -------------------- Logout Function --------------------
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear login token
    alert("You have been logged out!");
    navigate("/login"); // redirect to login page
  };

  // -------------------- Carousel Scroll --------------------
  const handleScroll = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const cardWidth = slider.firstChild?.offsetWidth + 24;
    setActiveFeature(Math.round(slider.scrollLeft / cardWidth));
  };

  useEffect(() => setActiveFeature(0), []);

  return (
    <div className="h-screen w-full bg-black flex flex-col relative">
      {/* Header */}
      <div className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-pink-400 to-red-400 shadow-md relative">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="bg-[#4A1F1F] text-white px-3 py-1 rounded-lg shadow-lg font-serif tracking-wide">Help</span>
          <span className="text-[#4A1F1F] font-serif text-3xl font-extrabold tracking-wide drop-shadow-[3px_3px_3px_rgba(0,0,0,0.4)]">MATE</span>
        </h1>

       {/* Working Logout */}
        <button
          onClick={handleLogout}
          className="absolute top-3 right-4 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-8 p-6 overflow-y-auto bg-white/5 backdrop-blur-lg">
        {/* Features Carousel */}
        <div className="relative w-full">
          <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto gap-6 px-2 py-2 scroll-smooth scrollbar-hide">
            {features.map((f, idx) => (
              <div key={idx} className={`flex-shrink-0 min-w-[260px] bg-gradient-to-br ${f.color} rounded-2xl shadow-lg text-white p-6`}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h2 className="font-bold text-xl">{f.title}</h2>
                <p className="text-sm opacity-90">{f.desc}</p>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {features.map((_, idx) => (
              <div key={idx} className={`w-3 h-3 rounded-full ${activeFeature === idx ? "bg-white" : "bg-white/30"}`}></div>
            ))}
          </div>
        </div>

        {/* Main Buttons + SOS */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-6 justify-center">
            {[
              { icon: "📞", color: "from-green-400 to-lime-500", action: () => setShowFakeCall(true) },
              { icon: "👨", color: "from-red-400 to-pink-500", action: () => setShowMenDefence(true) },
              { icon: "🎙️", color: "from-orange-400 to-yellow-500", action: startStopRecording },
              { icon: "👩‍🦰", color: "from-blue-400 to-indigo-500", action: () => setShowWomenDefence(true) },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${btn.color} flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 text-3xl text-white ring-2 ring-transparent hover:ring-white`}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <SOSButton />
        </div>

        {/* Guardian Chat */}
        <div
          onClick={() => setShowGuardianChat(true)}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full max-w-xl mx-auto flex items-center gap-5 cursor-pointer border border-white/20 hover:bg-white/20 transition-colors duration-300"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-500 text-white text-4xl shadow">🛡️</div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-white">Guardian Chat</h2>
            <p className="text-sm text-gray-200">Click to open chat</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMenDefence && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl relative">
            <Men />
            <button
              className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => setShowMenDefence(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showWomenDefence && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl relative">
            <Women />
            <button
              className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => setShowWomenDefence(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <GuardianChat isOpen={showGuardianChat} onClose={() => setShowGuardianChat(false)} />

      {showFakeCall && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md relative">
            <Fake_Call onClose={() => setShowFakeCall(false)} />
            <button
              className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => setShowFakeCall(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="w-full bg-gradient-to-r from-pink-300 to-red-300 py-4 flex justify-around shadow-inner">
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center text-white hover:scale-110 transition-transform duration-300"
        >
          <HomeIcon size={28} />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center text-white hover:scale-110 transition-transform duration-300"
        >
          <User size={28} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
