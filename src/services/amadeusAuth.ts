import type { AmadeusToken } from "@/types/flight";

class AmadeusAuthService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private readonly API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
  private readonly API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
  private readonly BASE_URL =
    import.meta.env.VITE_AMADEUS_API_URL || "https://test.api.amadeus.com";

  /**
   * Get a valid access token (fetches new one if expired)
   */
  async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    // Fetch new token
    return this.fetchNewToken();
  }

  /**
   * Fetch a fresh token from Amadeus
   */
  private async fetchNewToken(): Promise<string> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/v1/security/oauth2/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: this.API_KEY,
            client_secret: this.API_SECRET,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data: AmadeusToken = await response.json();

      // Cache token and expiry time (subtract 60s as buffer)
      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

      return this.token;
    } catch (error) {
      console.error("Amadeus authentication error:", error);
      throw new Error("Failed to authenticate with Amadeus API");
    }
  }

  /**
   * Clear cached token (useful for testing or manual refresh)
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

// Export singleton instance
export const amadeusAuth = new AmadeusAuthService();
