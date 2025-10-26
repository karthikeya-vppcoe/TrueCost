/**
 * A placeholder for an error tracking service like Sentry or Bugsnag.
 */
class ErrorTrackingService {
  init() {
    // Initialization logic for the error tracking service
    console.log("Error Tracking Service Initialized (mock)");
  }

  captureException(error: Error, context?: Record<string, any>) {
    // Logic to send the error and context to the tracking service
    console.error("Captured Exception (mock):", error, context);
  }

  captureMessage(message: string, context?: Record<string, any>) {
    // Logic to send a message to the tracking service
    console.log("Captured Message (mock):", message, context);
  }
}

const errorTracker = new ErrorTrackingService();
export default errorTracker;
