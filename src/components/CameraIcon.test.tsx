import { render } from "@testing-library/react";
import { CameraIcon } from "@components/CameraIcon";

describe("CameraIcon", () => {
  it("should render a decorative svg hidden from assistive technology", () => {
    const { container } = render(<CameraIcon />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
