import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { reportCrash } from "@services/crashReporter";

jest.mock("@services/logger");
jest.mock("@services/crashReporter");

function BrokenChild(): never {
  throw new Error("render failure");
}

describe("ErrorBoundary", () => {
  it("should render its children when nothing fails", () => {
    render(
      <ErrorBoundary>
        <p>Healthy content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Healthy content")).toBeInTheDocument();
  });

  it("should show a friendly fallback and report the crash when a child fails", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
    expect(screen.queryByText("render failure")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reload page" })).toHaveAttribute("href", "/");
    expect(reportCrash).toHaveBeenCalledWith("ErrorBoundary");
    consoleSpy.mockRestore();
  });
});
