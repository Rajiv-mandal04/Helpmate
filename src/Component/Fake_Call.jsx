import React, { useEffect, useRef, useState } from "react";

export default function Fake_Call({ onClose }) {
  const audioRef = useRef(null);
  const [calling, setCalling] = useState(true);
  const [connected, setConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0); // seconds counter
  const timerRef = useRef(null);

  useEffect(() => {
    // create audio element and play (loop)
    const audio = new Audio("src/ringtones/fake_ring.mp3");
    audio.loop = true;
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn("Autoplay blocked or audio error:", err);
    });

    // Vibrate while ringing
    if (navigator?.vibrate) {
      try {
        navigator.vibrate([800]);
        const vInterval = setInterval(() => navigator.vibrate([800]), 1600);
        audioRef.current.vInterval = vInterval;
      } catch {}
    }

    return () => stopAll();
  }, []);

  const stopAll = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (audioRef.current.vInterval) clearInterval(audioRef.current.vInterval);
        audioRef.current = null;
      }
      if (navigator?.vibrate) navigator.vibrate(0);
    } catch (e) {
      console.warn("Stop audio err", e);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleDecline = () => {
    stopAll();
    setCalling(false);
    setConnected(false);
    setCallDuration(0);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const handleAccept = () => {
    stopAll(); // stop ringtone
    setConnected(true);

    // start timer
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // convert seconds to MM:SS
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-3xl">
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Caller area */}
        <div className="p-6 flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            📞
          </div>

          {/* Title */}
          <div className="text-white text-xl font-semibold mt-2">
            {connected ? "On Call" : "Incoming Call"}
          </div>

          {/* Info text */}
          {!connected && (
            <div className="text-gray-300 text-sm mb-2">
              Tap to accept or decline
            </div>
          )}

          {/* Timer when connected */}
          {connected && (
            <div className="mt-2 text-green-400 font-semibold">
              {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 p-5 justify-center bg-gradient-to-t from-black/20 to-transparent border-t border-white/10">
          <button
            onClick={handleDecline}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            {connected ? "End Call" : "Decline"}
          </button>

          {!connected && (
            <button
              onClick={handleAccept}
              className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
