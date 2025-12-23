type EventProperties = Record<string, string | number | object | boolean>;

class AnalyticsTracker {
  private sessionId?: string;
  private studentId?: number;

  private getOrCreateSessionId() {
    if (typeof window === "undefined") {
      return ""; // Return empty string for SSR
    }
    let sessionId = sessionStorage.getItem("kottioDev_session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("kottioDev_session", sessionId);
    }
    return sessionId;
  }

  identify(studentId: number) {
    this.studentId = studentId;
    if (!this.sessionId) {
      this.sessionId = this.getOrCreateSessionId();
    }
  }

  async track(
    eventName: string,
    adviceId: number | null,
    properties: EventProperties = {}
  ) {
    if (!this.studentId) {
      console.warn("Cannot Create event for non identified users");
      return;
    }

    try {
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: this.studentId,
          sessionId: this.sessionId,
          eventName,
          adviceId,
          properties,
        }),
      });
    } catch (error) {
      console.error("Analytics Failed", error);
    }
  }
}
export const analytics = new AnalyticsTracker();
export const track = analytics.track.bind(analytics);
export const identify = analytics.identify.bind(analytics);
