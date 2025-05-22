import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Room from "./Room";

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  function handleJoin() {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  }

  return (
    <main className="flex flex-col text-white justify-center items-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Zego Cloud Video Conference
      </h1>
      <p className="mb-8 text-lg text-gray-400 text-center max-w-md">
        Seamlessly connect with people around the world. Join your meeting by entering the room ID below.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 rounded-lg border border-2 border-blue-700 text-black w-64 sm:w-80 focus:outline-none text-white focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
        >
          Join Room
        </button>
      </div>
    </main>
  );
}

export default App;
