import { logger } from "@services/logger";

export type AnalyticsEventProperties = Readonly<Record<string, string>>;

// TODO: forward events to the analytics provider once one is chosen
export const analytics = {
  track(eventName: string, properties: AnalyticsEventProperties): void {
    logger.info(`[analytics] ${eventName} ${JSON.stringify(properties)}`);
  },
};
