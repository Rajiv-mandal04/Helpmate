import { useState, useRef } from "react";

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const toggleRecording = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const file = new File([blob], `recording_${Date.now()}.webm`);

          const formData = new FormData();
          formData.append("audio", file);

          setStatus("⏳ Uploading...");

          try {
            const res = await fetch("http://localhost:5000/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            setStatus("✅ " + data.message);
          } catch {
            setStatus("❌ Upload failed");
          }
        };

        mediaRecorderRef.current.start();
        setRecording(true);
        setStatus("🔴 Recording...");
      } catch {
        setStatus("❌ Microphone access denied");
      }
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatus("⏳ Processing...");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggleRecording}
        className={`px-6 py-3 rounded-xl text-white font-bold ${
          recording ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>{status}</p>
    </div>
  );
}

export default VoiceRecorder;
