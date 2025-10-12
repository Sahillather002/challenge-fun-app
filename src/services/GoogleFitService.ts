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
   * Check if URL contains OAuth callback token
   */
  checkUrlForToken(): string | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (token) {
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          return token;
        }
      }
    }
    return null;
  }

  /**
   * Authorize Google Fit via OAuth
   */
  async authorize(): Promise<boolean> {
    try {
      // Try stored token first
      const storedToken = await storage.getItem("google_fit_token");
      console.log("my stored token", storedToken);
      if (storedToken) {
        this.accessToken = storedToken;
        this.isAuthorized = true;
        return true;
      }

      // Check if we just returned from OAuth (token in URL)
      const urlToken = this.checkUrlForToken();
      console.log("my url token", urlToken);
      if (urlToken) {
        this.accessToken = urlToken;
        this.isAuthorized = true;
        await storage.setItem("google_fit_token", this.accessToken);
        return true;
      }

      const clientId = Constants.expoConfig?.extra?.googleFitClientId;
      if (!clientId) {
        throw new Error("Google Fit Client ID not configured");
      }

      if (Platform.OS === 'web') {
        console.log('=== OAUTH DEBUG INFO ===');
        console.log('Full URL:', window.location.href);
        console.log('Origin:', window.location.origin);
        console.log('User Agent:', navigator.userAgent);
        console.log('========================');

        // Use direct redirect flow (same window) instead of popup
        const redirectUri = `${window.location.origin}/`;

        console.log('Redirect URI:', redirectUri);

        // Build the OAuth URL manually for same-window redirect
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('response_type', 'token');
        authUrl.searchParams.append('scope', GOOGLE_FIT_SCOPES.join(' '));
        authUrl.searchParams.append('prompt', 'consent'); // Force consent screen

        console.log('Full OAuth URL:', authUrl.toString());

        // Mark that we're starting auth flow
        localStorage.setItem('google_fit_auth_pending', 'true');
        
        // Redirect in the same window (not popup)
        window.location.href = authUrl.toString();
        
        // Return false because we're redirecting (will complete on return)
        return false;
      }

      // For native platforms (Android/iOS)
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.healthcompetition.app',
      });

      console.log('OAuth Config:', {
        clientId,
        redirectUri,
        platform: Platform.OS
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      };

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: GOOGLE_FIT_SCOPES,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        usePKCE: false,
      });

      // For native, useProxy goes in promptAsync options
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
    // Check if we have a stored token
    if (!this.isAuthorized) {
      const storedToken = await storage.getItem("google_fit_token");
      if (storedToken) {
        this.accessToken = storedToken;
        this.isAuthorized = true;
      }
    }
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
      const steps = bucket.dataset?.[0]?.point?.reduce(
        (sum: number, p: any) => sum + (p.value?.[0]?.intVal || 0),
        0
      ) || 0;

      const bucketStartTime = parseInt(bucket.startTimeMillis || bucket.startTime || '0');
      return {
        date: new Date(bucketStartTime).toISOString().split("T")[0],
        steps: steps,
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
    try {
      console.log('Fetching steps:', {
        start: new Date(startTimeMillis).toISOString(),
        end: new Date(endTimeMillis).toISOString(),
        hasToken: !!this.accessToken
      });

      // Try multiple data sources for better compatibility
      const dataSources = [
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas",
      ];

      const response = await fetch(
        `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            aggregateBy: dataSources.map(dataSourceId => ({
              dataTypeName: "com.google.step_count.delta",
              dataSourceId,
            })),
            bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
            startTimeMillis,
            endTimeMillis,
          }),
        }
      );

      console.log('API Response Status:', response.status);

      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error - token may be expired');
        // Clear invalid token
        await this.disconnect();
        throw new Error('Authentication failed. Please reconnect to Google Fit.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Google Fit API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', JSON.stringify(data, null, 2));

      // Validate response structure
      if (!data.bucket || !Array.isArray(data.bucket)) {
        console.warn('Invalid response structure - no buckets found');
        return 0;
      }

      if (data.bucket.length === 0) {
        console.log('No data buckets returned - user may have no step data');
        return 0;
      }

      // Extract steps from the first bucket, aggregating all data sources
      const bucket = data.bucket[0];
      if (!bucket.dataset || !Array.isArray(bucket.dataset) || bucket.dataset.length === 0) {
        console.log('No datasets in bucket');
        return 0;
      }

      // Sum steps from all data sources
      let totalSteps = 0;
      for (const dataset of bucket.dataset) {
        if (!dataset.point || !Array.isArray(dataset.point)) {
          continue;
        }

        const datasetSteps = dataset.point.reduce(
          (sum: number, p: any) => {
            const value = p.value?.[0]?.intVal || 0;
            return sum + value;
          },
          0
        );

        console.log(`Steps from ${dataset.dataSourceId}:`, datasetSteps);
        totalSteps += datasetSteps;
      }

      console.log('Total steps calculated:', totalSteps);
      return totalSteps;
    } catch (error: any) {
      console.error('Error in fetchStepCount:', error);
      throw error;
    }
  }

  // 🔒 Internal method to fetch bucketed step data for date ranges
  private async fetchStepsByBucket(startTimeMillis: number, endTimeMillis: number, durationMillis: number): Promise<any[]> {
    try {
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

      if (response.status === 401 || response.status === 403) {
        await this.disconnect();
        throw new Error('Authentication failed. Please reconnect to Google Fit.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Google Fit API error: ${response.status}`);
      }

      const data = await response.json();
      return data.bucket || [];
    } catch (error: any) {
      console.error('Error in fetchStepsByBucket:', error);
      throw error;
    }
  }
}

export default GoogleFitService;
