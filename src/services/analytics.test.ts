import { analytics } from "@services/analytics";
import { logger } from "@services/logger";

jest.mock("@services/logger");

describe("analytics", () => {
  it("should record the event name and its properties", () => {
    analytics.track("photo_captured", { status: "ok" });

    expect(logger.info).toHaveBeenCalledWith('[analytics] photo_captured {"status":"ok"}');
  });
});
