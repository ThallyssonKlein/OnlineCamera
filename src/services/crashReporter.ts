import { logger } from "@services/logger";

// TODO: forward crashes to the crash-reporting provider once one is chosen
export function reportCrash(crashSource: string): void {
  logger.warn(`[crashReporter] no provider configured, crash from ${crashSource} was not forwarded`);
}
