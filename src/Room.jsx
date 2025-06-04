// Room.jsx
import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 } from 'uuid';
import CodeEditor from './CodeEditor';

function Room() {
  const { roomId } = useParams();
  const meetingRef = useRef(null);

  useEffect(() => {
    const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      v4(),
      "Krishna"
    );

    const ui = ZegoUIKitPrebuilt.create(kitToken);

    ui.joinRoom({
      container: meetingRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  }, [roomId]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Welcome to Room <span className="text-blue-500">{roomId}</span>
      </h2>
      <div className="flex flex-col md:flex-row w-full h-[80vh] gap-4 px-4">
        <div ref={meetingRef} className="flex-1 bg-gray-900 rounded-lg shadow-lg overflow-hidden" />
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default Room;
