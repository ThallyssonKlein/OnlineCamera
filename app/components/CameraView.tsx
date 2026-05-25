"use client";

import { useRef } from "react";
import { WebCamera, WebCameraHandler } from "@shivantra/react-web-camera";

export default function CameraView() {
  const cameraHandler = useRef<WebCameraHandler>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <WebCamera
        ref={cameraHandler}
        captureMode="front"
        style={{ width: "100%", maxWidth: 640, height: 480, borderRadius: 12 }}
      />
      <button
        onClick={() => cameraHandler.current?.switch()}
        className="px-6 py-2 rounded-full bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors"
      >
        Alternar câmera
      </button>
    </div>
  );
}
