import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CameraView } from "@components/CameraView";
import type { CameraCapture } from "@hooks/useCameraCapture";
import { useCameraCapture } from "@hooks/useCameraCapture";

jest.mock("@hooks/useCameraCapture");
jest.mock("@shivantra/react-web-camera", () => ({
  WebCamera: ({ onError }: { onError: (error: Error) => void }) => (
    <button type="button" onClick={() => onError(new Error("camera failure"))}>
      Simulate camera failure
    </button>
  ),
}));

function makeCameraCapture(overrides?: Partial<CameraCapture>): CameraCapture {
  return {
    cameraRef: { current: null },
    capturePhoto: jest.fn(),
    switchCamera: jest.fn(),
    reportCameraError: jest.fn(),
    ...overrides,
  };
}

describe("CameraView", () => {
  it("should capture a photo when the capture button is clicked", async () => {
    const cameraCapture = makeCameraCapture();
    jest.mocked(useCameraCapture).mockReturnValue(cameraCapture);
    const user = userEvent.setup();
    render(<CameraView />);

    await user.click(screen.getByRole("button", { name: "Capture photo" }));

    expect(cameraCapture.capturePhoto).toHaveBeenCalled();
  });

  it("should switch the camera when the switch button is clicked", async () => {
    const cameraCapture = makeCameraCapture();
    jest.mocked(useCameraCapture).mockReturnValue(cameraCapture);
    const user = userEvent.setup();
    render(<CameraView />);

    await user.click(screen.getByRole("button", { name: "Switch camera" }));

    expect(cameraCapture.switchCamera).toHaveBeenCalled();
  });

  it("should forward camera errors to the capture hook", async () => {
    const cameraCapture = makeCameraCapture();
    jest.mocked(useCameraCapture).mockReturnValue(cameraCapture);
    const user = userEvent.setup();
    render(<CameraView />);

    await user.click(screen.getByRole("button", { name: "Simulate camera failure" }));

    expect(cameraCapture.reportCameraError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should show the error message as an alert when there is one", () => {
    jest.mocked(useCameraCapture).mockReturnValue(makeCameraCapture({ errorMessage: "Something failed" }));

    render(<CameraView />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });

  it("should not show an alert when there is no error", () => {
    jest.mocked(useCameraCapture).mockReturnValue(makeCameraCapture());

    render(<CameraView />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
