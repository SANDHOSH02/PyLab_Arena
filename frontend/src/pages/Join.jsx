import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Join() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomId || !userName) return;
    const params = new URLSearchParams({ roomId, userName }).toString();
    navigate(`/editor?${params}`);
  };

  const createRoom = () => {
    const newId = Math.random().toString(36).slice(2, 10);
    setRoomId(newId);
  };

  return (
    <div className="join-container">
      <div className="join-form">
        <h1>Join a Collaboration Room</h1>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID (leave blank to create)" />
        <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleJoin} style={{ flex: 1 }}>Join Room</button>
          <button onClick={createRoom} style={{ flex: 1 }}>Create Room</button>
        </div>
        <p style={{ marginTop: 12, fontSize: 13, opacity: 0.9 }}>Create a new room or paste an existing Room ID and join. Python is selected by default in the editor.</p>
      </div>
    </div>
  );
}
