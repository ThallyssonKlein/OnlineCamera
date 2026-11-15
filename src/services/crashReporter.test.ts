import { reportCrash } from "@services/crashReporter";
import { logger } from "@services/logger";

jest.mock("@services/logger");

describe("reportCrash", () => {
  it("should record that the crash was not forwarded to any provider", () => {
    reportCrash("ErrorBoundary");

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("ErrorBoundary"));
  });
});
