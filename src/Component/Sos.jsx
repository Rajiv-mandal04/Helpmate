import { useState } from "react";

function SOSButton() {
  const [location, setLocation] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const sendLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation supported nahi hai browser me.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setError(null);

        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const email = `mailto:aashutoshsah1679@gmail.com?subject=SOS Location&body=Here is my location: ${mapsLink}`;

        // Open default email client with pre-filled email
        window.location.href = email;

        // Show "Done" below button
        setDone(true);
      },
      (err) => setError("Location error: " + err.message),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={sendLocation}
        className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center shadow-xl text-white text-4xl font-bold hover:scale-110 transition-transform duration-300 ring-4 ring-pink-400"
      >
        SOS
      </button>

      {location && (
        <p className="text-sm text-white">
          📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
      )}

      {done && <p className="text-green-400 text-sm">✅ Done</p>}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

export default SOSButton;
