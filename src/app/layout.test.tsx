import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("should render its children inside the layout", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <RootLayout>
        <p>Page content</p>
      </RootLayout>,
    );

    expect(screen.getByText("Page content")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
