import { auth } from "@acme/auth";

// Time before session expiry when we should attempt to refresh (5 minutes)
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getSessionWithRefresh() {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    if (!session) {
      return null;
    }

    // Check if session needs refresh
    const expiresAt = new Date(session.session.expiresAt).getTime();
    const now = Date.now();
    
    if (expiresAt - now < REFRESH_THRESHOLD) {
      // Attempt to refresh the session
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.session.token}`,
        },
      });

      if (response.ok) {
        const newSession = await response.json();
        // Return a new session with the refreshed token
        return {
          ...session,
          session: {
            ...session.session,
            token: newSession.token,
            expiresAt: newSession.expiresAt,
          },
        };
      }
    }

    return session;
  } catch (error) {
    console.error("Error getting/refreshing session:", error);
    return null;
  }
}

export async function refreshSession(token: string) {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error refreshing session:", error);
    throw error;
  }
} 