import { DailyCall } from "@daily-co/daily-js";
import { Channel } from "phoenix";

declare global {
  interface Window {
    // https://github.com/microsoft/TypeScript/issues/31686
    webkitAudioContext: typeof AudioContext;
    callObject: DailyCall;
    analytics: SegmentAnalytics.AnalyticsJS;
    Intercom: Intercom_.IntercomCommand;
    inevent: Channel | null;
    spamTable: (() => void) | null;
  }

  interface Navigator {
    deviceMemory?: number;
  }
}
