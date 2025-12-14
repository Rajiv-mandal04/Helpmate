import React, { useState, useRef } from "react";

const TIPS = [
  {
    id: 1,
    title: "Strong Stance",
    image: "src/assets/Strong Stance w.jpeg",
    snippet: "Feet shoulder-width, knees soft, hands up.",
    details: "If walking alone, take a strong stance: feet shoulder-width, knees bent, hands up. Quick balance and push-away moves help you defend yourself."
  },
  {
    id: 2,
    title: "Escape Grabs",
    image: "src/assets/Escape Grabs w.jpeg",
    snippet: "Twist wrist towards thumb & pull away.",
    details: "If grabbed, twist your wrist toward the thumb (weak spot) and step back to escape. Practice escape techniques in safe settings."
  },
  {
    id: 3,
    title: "Use Your Voice",
    image: "src/assets/Use Your Voice w.jpeg",
    snippet: "Shout 'HELP' or use alarm.",
    details: "Shout loudly or use a personal alarm if you feel threatened. Attention can scare away attackers quickly."
  },
  {
    id: 4,
    title: "Maintain Distance",
    image: "src/assets/Maintain Distance w.jpeg",
    snippet: "Keep strangers at arm's length.",
    details: "Keep a safe distance from strangers. This reduces risks and gives you time to react."
  },
  {
    id: 5,
    title: "Stay Alert",
    image: "src/assets/Stay Alert w.jpeg",
    snippet: "Watch your surroundings constantly.",
    details: "Be aware of people and surroundings. Spot suspicious behavior early to avoid dangerous situations."
  },
  {
    id: 6,
    title: "Escape Routes",
    image: "src/assets/Escape Routes w.webp",
    snippet: "Know nearest exits.",
    details: "Always know nearby exits when in unfamiliar areas. This ensures you can leave quickly if needed."
  },
  {
    id: 7,
    title: "Trust Instincts",
    image: "src/assets/Trust Instincts w.jpeg",
    snippet: "If something feels wrong, leave.",
    details: "Trust your gut. If a situation feels unsafe, leave immediately or seek help."
  },
  {
    id: 8,
    title: "Carry Safety Tools",
    image: "src/assets/Carry Safety Tools w.jpeg",
    snippet: "Pepper spray, whistle, or stun device.",
    details: "Carry simple defensive tools like pepper spray or a whistle and know how to use them safely."
  },
  {
    id: 9,
    title: "Avoid Isolated Areas",
    image: "src/assets/Avoid Isolated Areas w.jpeg",
    snippet: "Stick to well-lit areas.",
    details: "Avoid dark or isolated areas. Walk in well-lit, populated zones when possible."
  },
  {
    id: 10,
    title: "Contact Help",
    image: "src/assets/Contact Help w.jpeg",
    snippet: "Have an emergency contact ready.",
    details: "Have a trusted contact to call in emergencies. Quick communication can prevent harm."
  },
];

export default function WomenSelfDefencePro() {
  const [openTip, setOpenTip] = useState(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const cardWidth = slider.firstChild?.offsetWidth + 16;
    const index = Math.round(slider.scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  const closeModal = () => setOpenTip(null);

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* Main Content Blur when modal open */}
      <div className={`${openTip ? "filter blur-[60px] scale-95 transition-all duration-500" : ""}`}>
        <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
          Women Self-Defence — Tips
        </h2>

        {/* Horizontal Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
          >
            {TIPS.map((tip, idx) => (
              <div
                key={tip.id}
                className={`min-w-[260px] bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer ${activeIndex === idx ? "ring-2 ring-white" : ""}`}
              >
                <img src={tip.image} alt={tip.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white">{tip.title}</h3>
                  <p className="text-gray-300 mt-2">{tip.snippet}</p>
                  <button
                    className="w-full mt-4 bg-gradient-to-r from-pink-400 to-red-500 text-black font-semibold py-2 rounded-lg hover:scale-105 transition"
                    onClick={() => setOpenTip(tip.id)}
                  >
                    View Tip
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {TIPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${activeIndex === idx ? "bg-white" : "bg-white/30"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {openTip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-[60px] flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-3xl max-w-xl w-full p-6 relative shadow-2xl border border-white/20 animate-fadeIn">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-2xl z-50"
            >
              ✕
            </button>

            <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              {TIPS.find(t => t.id === openTip)?.title}
            </h3>
            <p className="text-gray-300 text-lg">
              {TIPS.find(t => t.id === openTip)?.details}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:scale-105 transition"
                onClick={() => {
                  try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = "sine";
                    o.frequency.value = 1200;
                    g.gain.value = 0.3;
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start();
                    setTimeout(() => o.stop(), 2000);
                  } catch {}
                }}
              >
                Play Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
