import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

init({
  dsn: "https://255f0f3bbc6db54d5483aaccd28e247f@o4508289914372096.ingest.us.sentry.io/4508290338390016",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});