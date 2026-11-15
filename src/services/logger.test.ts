import { logger } from "@services/logger";

describe("logger", () => {
  it("should write info messages to console.info", () => {
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => undefined);

    logger.info("[Test] hello");

    expect(infoSpy).toHaveBeenCalledWith("[Test] hello");
    infoSpy.mockRestore();
  });

  it("should write warnings to console.warn", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);

    logger.warn("[Test] careful");

    expect(warnSpy).toHaveBeenCalledWith("[Test] careful");
    warnSpy.mockRestore();
  });

  it("should write errors to console.error together with the error object", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const failure = new Error("boom");

    logger.error("[Test] failed", failure);

    expect(errorSpy).toHaveBeenCalledWith("[Test] failed", failure);
    errorSpy.mockRestore();
  });
});
