import { useRef, useState } from "react";
import type { RefObject } from "react";
import type { WebCameraHandler } from "@shivantra/react-web-camera";
import { analytics } from "@services/analytics";
import { downloadFile } from "@services/fileDownload";
import { logger } from "@services/logger";

const ERROR_CAPTURE_PHOTO = "We could not capture the photo. Please try again.";
const ERROR_SWITCH_CAMERA = "We could not switch the camera. Please try again.";
const ERROR_CAMERA_UNAVAILABLE =
  "The camera is unavailable. Check that it is connected and that access is allowed in your browser.";

const EVENT_PHOTO_CAPTURED = "photo_captured";
const EVENT_CAMERA_SWITCHED = "camera_switched";
const EVENT_CAMERA_ERROR = "camera_error";
const STATUS_OK = "ok";
const STATUS_FAILED = "failed";

export interface CameraCapture {
  cameraRef: RefObject<WebCameraHandler | null>;
  errorMessage?: string;
  capturePhoto: () => Promise<void>;
  switchCamera: () => Promise<void>;
  reportCameraError: (error: Error) => void;
}

export function useCameraCapture(): CameraCapture {
  const cameraRef = useRef<WebCameraHandler>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function capturePhoto(): Promise<void> {
    try {
      const photo = await cameraRef.current?.capture();
      if (!photo) throw new Error("[useCameraCapture] capture returned no file");

      downloadFile(photo);
      setErrorMessage(undefined);
      logger.info("[useCameraCapture] photo captured and downloaded");
      analytics.track(EVENT_PHOTO_CAPTURED, { status: STATUS_OK });
    } catch (err: unknown) {
      logger.error("[useCameraCapture] failed to capture photo", err);
      analytics.track(EVENT_PHOTO_CAPTURED, { status: STATUS_FAILED });
      setErrorMessage(ERROR_CAPTURE_PHOTO);
    }
  }

  async function switchCamera(): Promise<void> {
    try {
      await cameraRef.current?.switch();
      setErrorMessage(undefined);
      analytics.track(EVENT_CAMERA_SWITCHED, { status: STATUS_OK });
    } catch (err: unknown) {
      logger.error("[useCameraCapture] failed to switch camera", err);
      analytics.track(EVENT_CAMERA_SWITCHED, { status: STATUS_FAILED });
      setErrorMessage(ERROR_SWITCH_CAMERA);
    }
  }

  function reportCameraError(error: Error): void {
    logger.error("[useCameraCapture] camera reported an error", error);
    analytics.track(EVENT_CAMERA_ERROR, { status: STATUS_FAILED });
    setErrorMessage(ERROR_CAMERA_UNAVAILABLE);
  }

  return { cameraRef, errorMessage, capturePhoto, switchCamera, reportCameraError };
}
