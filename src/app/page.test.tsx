import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("@components/CameraView", () => ({
  CameraView: () => <div>Camera view</div>,
}));

describe("Home", () => {
  it("should render the camera view", () => {
    render(<Home />);

    expect(screen.getByText("Camera view")).toBeInTheDocument();
  });
});
