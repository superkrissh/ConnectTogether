import React from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 } from 'uuid';



function Room() {
  const { roomId } = useParams();

  async function meetingUI(element) {
    const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret =  import.meta.env.VITE_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      v4(),
      "Krishna"
    );

    const ui = ZegoUIKitPrebuilt.create(kitToken);

    ui.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-10 px-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Welcome to Room <span className="text-blue-500">{roomId}</span>
      </h2>
      <div
        ref={meetingUI}
        className="w-full max-w-6xl h-[80vh] bg-gray-900 rounded-lg shadow-lg overflow-hidden"
      ></div>
    </div>
  );
}

export default Room;
