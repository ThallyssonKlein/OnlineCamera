"use client";

import { WebCamera } from "@shivantra/react-web-camera";
import { CameraIcon } from "@components/CameraIcon";
import { useCameraCapture } from "@hooks/useCameraCapture";

const CAMERA_MAX_WIDTH_PX = 640;
const CAMERA_HEIGHT_PX = 480;
const CAMERA_BORDER_RADIUS_PX = 12;
const CAMERA_STYLE = {
  width: "100%",
  maxWidth: CAMERA_MAX_WIDTH_PX,
  height: CAMERA_HEIGHT_PX,
  borderRadius: CAMERA_BORDER_RADIUS_PX,
};

export function CameraView() {
  const { cameraRef, errorMessage, capturePhoto, switchCamera, reportCameraError } = useCameraCapture();

  return (
    <div className="flex flex-col items-center gap-4">
      <WebCamera ref={cameraRef} captureMode="front" style={CAMERA_STYLE} onError={reportCameraError} />
      {errorMessage && <CameraErrorMessage message={errorMessage} />}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={capturePhoto}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-action-primary text-on-action-primary text-sm font-medium hover:bg-action-primary-hover transition-colors"
        >
          <CameraIcon />
          Capture photo
        </button>
        <button
          type="button"
          onClick={switchCamera}
          className="px-6 py-2 rounded-full bg-action-secondary text-on-action-secondary text-sm hover:bg-action-secondary-hover transition-colors"
        >
          Switch camera
        </button>
      </div>
    </div>
  );
}

function CameraErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="text-sm text-feedback-error">
      {message}
    </p>
  );
}
