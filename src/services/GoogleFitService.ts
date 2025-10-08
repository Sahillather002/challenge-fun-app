import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const GOOGLE_FIT_SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.location.read",
  "https://www.googleapis.com/auth/fitness.body.read",
];

// Web-compatible storage wrapper
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export class GoogleFitService {
  private static instance: GoogleFitService;
  private accessToken: string | null = null;
  private isAuthorized = false;

  static getInstance(): GoogleFitService {
    if (!GoogleFitService.instance) {
      GoogleFitService.instance = new GoogleFitService();
    }
    return GoogleFitService.instance;
  }

  /**
   * Authorize Google Fit via OAuth
   */
  async authorize(): Promise<boolean> {
    try {
      // Try stored token first
      const storedToken = await storage.getItem("google_fit_token");
      if (storedToken) {
        this.accessToken = storedToken;
        this.isAuthorized = true;
        return true;
      }

      const clientId = Constants.expoConfig?.extra?.googleFitClientId;
      if (!clientId) {
        throw new Error("Google Fit Client ID not configured");
      }

      // For web, use different redirect URI
      const redirectUri = Platform.OS === 'web' 
        ? window.location.origin 
        : AuthSession.makeRedirectUri({ scheme: 'com.healthcompetition.app' });

      console.log('OAuth Config:', { clientId, redirectUri, platform: Platform.OS });

      // Create discovery document for Google OAuth
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      };

      // Create auth request - implicit flow without PKCE
      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: GOOGLE_FIT_SCOPES,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        usePKCE: false, // Disable PKCE for implicit flow
      });

      // Prompt for authorization
      const result = await request.promptAsync(discovery);

      console.log('OAuth Result:', result);

      if (result.type === "success" && result.params.access_token) {
        this.accessToken = result.params.access_token;
        this.isAuthorized = true;
        await storage.setItem("google_fit_token", this.accessToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Google Fit authorization failed:", error);
      return false;
    }
  }

  async isAuthorizedCheck(): Promise<boolean> {
    return this.isAuthorized;
  }

  private async ensureAuthorized(): Promise<void> {
    if (!this.isAuthorized || !this.accessToken) {
      const authorized = await this.authorize();
      if (!authorized) {
        throw new Error("Google Fit not authorized");
      }
    }
  }

  /**
   * Get today’s total steps
   */
  async getTodaySteps(): Promise<number> {
    await this.ensureAuthorized();

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = Date.now();

    return await this.fetchStepCount(startOfDay, endOfDay);
  }

  /**
   * Get weekly total steps
   */
  async getWeeklySteps(): Promise<number> {
    await this.ensureAuthorized();

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    return await this.fetchStepCount(start.getTime(), end.getTime());
  }

  /**
   * Get monthly total steps
   */
  async getMonthlySteps(): Promise<number> {
    await this.ensureAuthorized();

    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);

    return await this.fetchStepCount(start.getTime(), end.getTime());
  }

  /**
   * Get daily step counts within a date range
   */
  async getStepsForDateRange(startDate: Date, endDate: Date): Promise<{ date: string; steps: number }[]> {
    await this.ensureAuthorized();

    const response = await this.fetchStepsByBucket(startDate.getTime(), endDate.getTime(), 86400000);

    return response.map((bucket: any) => {
      const steps = bucket.dataset[0]?.point?.reduce(
        (sum: number, p: any) => sum + (p.value[0]?.intVal || 0),
        0
      );
      return {
        date: new Date(bucket.startTimeMillis).toISOString().split("T")[0],
        steps: steps || 0,
      };
    });
  }

  /**
   * Start mock step recording (for UX flow)
   */
  async startRecordingSteps(): Promise<void> {
    await this.ensureAuthorized();
    console.log("Started recording steps (Google Fit does this automatically)");
  }

  async stopRecordingSteps(): Promise<void> {
    console.log("Stopped recording steps (no explicit stop needed for Google Fit)");
  }

  async disconnect(): Promise<void> {
    await storage.deleteItem("google_fit_token");
    this.accessToken = null;
    this.isAuthorized = false;
    console.log("Disconnected from Google Fit");
  }

  static isHealthTrackingAvailable(): boolean {
    return Platform.OS === "android"; // Google Fit is Android-only
  }

  async getDailyGoal(): Promise<number> {
    // You can store user goals in storage or backend
    const stored = await storage.getItem("daily_goal");
    return stored ? parseInt(stored) : 10000; // default 10,000
  }

  async saveDailyGoal(steps: number): Promise<void> {
    await storage.setItem("daily_goal", steps.toString());
    console.log(`Daily goal set to ${steps} steps`);
  }

  // 🔒 Internal method to fetch total steps between timestamps
  private async fetchStepCount(startTimeMillis: number, endTimeMillis: number): Promise<number> {
    const response = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            },
          ],
          bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
          startTimeMillis,
          endTimeMillis,
        }),
      }
    );

    const data = await response.json();

    if (!data.bucket?.length) return 0;

    const steps = data.bucket[0].dataset[0]?.point?.reduce(
      (sum: number, p: any) => sum + (p.value[0]?.intVal || 0),
      0
    );

    return steps || 0;
  }

  // 🔒 Internal method to fetch bucketed step data for date ranges
  private async fetchStepsByBucket(startTimeMillis: number, endTimeMillis: number, durationMillis: number): Promise<any[]> {
    const response = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
            dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
          },
        ],
        bucketByTime: { durationMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    });

    const data = await response.json();
    return data.bucket || [];
  }
}

export default GoogleFitService;
