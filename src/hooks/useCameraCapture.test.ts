import { act, renderHook } from "@testing-library/react";
import type { WebCameraHandler } from "@shivantra/react-web-camera";
import { useCameraCapture } from "@hooks/useCameraCapture";
import { analytics } from "@services/analytics";
import { downloadFile } from "@services/fileDownload";

jest.mock("@services/logger");
jest.mock("@services/analytics");
jest.mock("@services/fileDownload");

function makeCameraHandler(overrides?: Partial<WebCameraHandler>): WebCameraHandler {
  return {
    capture: jest.fn(),
    switch: jest.fn(),
    getMode: jest.fn(),
    stop: jest.fn(),
    ...overrides,
  };
}

describe("useCameraCapture", () => {
  it("should download the captured photo and track success", async () => {
    const photo = new File(["data"], "photo.jpeg");
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({ capture: jest.fn().mockResolvedValue(photo) });

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(downloadFile).toHaveBeenCalledWith(photo);
    expect(analytics.track).toHaveBeenCalledWith("photo_captured", { status: "ok" });
    expect(result.current.errorMessage).toBeUndefined();
  });

  it("should expose a friendly message when the capture returns no file", async () => {
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({ capture: jest.fn().mockResolvedValue(null) });

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(downloadFile).not.toHaveBeenCalled();
    expect(analytics.track).toHaveBeenCalledWith("photo_captured", { status: "failed" });
    expect(result.current.errorMessage).toBe("We could not capture the photo. Please try again.");
  });

  it("should expose a friendly message when the capture rejects", async () => {
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({
      capture: jest.fn().mockRejectedValue(new Error("device busy")),
    });

    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(result.current.errorMessage).toBe("We could not capture the photo. Please try again.");
  });

  it("should clear a previous error after a successful capture", async () => {
    const photo = new File(["data"], "photo.jpeg");
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({
      capture: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(photo),
    });

    await act(async () => {
      await result.current.capturePhoto();
    });
    await act(async () => {
      await result.current.capturePhoto();
    });

    expect(result.current.errorMessage).toBeUndefined();
  });

  it("should switch the camera and track success", async () => {
    const switchCamera = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({ switch: switchCamera });

    await act(async () => {
      await result.current.switchCamera();
    });

    expect(switchCamera).toHaveBeenCalled();
    expect(analytics.track).toHaveBeenCalledWith("camera_switched", { status: "ok" });
  });

  it("should expose a friendly message when switching the camera fails", async () => {
    const { result } = renderHook(() => useCameraCapture());
    result.current.cameraRef.current = makeCameraHandler({
      switch: jest.fn().mockRejectedValue(new Error("no other camera")),
    });

    await act(async () => {
      await result.current.switchCamera();
    });

    expect(result.current.errorMessage).toBe("We could not switch the camera. Please try again.");
  });

  it("should expose a friendly message when the camera reports an error", () => {
    const { result } = renderHook(() => useCameraCapture());

    act(() => {
      result.current.reportCameraError(new Error("NotAllowedError"));
    });

    expect(result.current.errorMessage).toContain("The camera is unavailable");
    expect(result.current.errorMessage).not.toContain("NotAllowedError");
  });
});
