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
  private tokenExpiresAt: number | null = null;
  private isAuthorized = false;
  private useMockData = false; // Set to true for testing without Android device

  private constructor() {
    // Load token from storage on initialization
    this.loadTokenFromStorage();
  }

  private async loadTokenFromStorage() {
    try {
      const storedToken = await storage.getItem("google_fit_token");
      const storedExpiry = await storage.getItem("google_fit_token_expiry");
      
      if (storedToken && storedExpiry) {
        const expiresAt = parseInt(storedExpiry);
        const now = Date.now();
        
        // Check if token is still valid (with 5 min buffer)
        if (expiresAt > now + 300000) {
          this.accessToken = storedToken;
          this.tokenExpiresAt = expiresAt;
          this.isAuthorized = true;
          console.log('✅ Valid token loaded from storage');
          console.log('⏰ Token expires in:', Math.round((expiresAt - now) / 60000), 'minutes');
        } else {
          console.log('⚠️ Token expired, clearing...');
          await this.disconnect();
        }
      }
    } catch (error) {
      console.error('Error loading token from storage:', error);
    }
  }

  static getInstance(): GoogleFitService {
    if (!GoogleFitService.instance) {
      GoogleFitService.instance = new GoogleFitService();
    }
    return GoogleFitService.instance;
  }

  /**
   * Manually set the access token (used after OAuth callback)
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.isAuthorized = true;
    console.log('Access token set, service is now authorized');
  }

  /**
   * Check if URL contains OAuth callback token
   * This should only run in the popup window, not the main app
   */
  checkUrlForToken(): string | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (token) {
          console.log('🔑 Token found in URL (popup window)');
          
          // Extract expiry time (Google returns expires_in in seconds)
          const expiresIn = params.get('expires_in');
          const expiresAt = expiresIn ? Date.now() + (parseInt(expiresIn) * 1000) : Date.now() + 3600000; // Default 1 hour
          
          // This is the popup window - send message to opener and close
          if (window.opener && !window.opener.closed) {
            console.log('📤 Sending token to parent window');
            window.opener.postMessage({
              type: 'GOOGLE_FIT_AUTH_SUCCESS',
              token: token,
              expiresAt: expiresAt
            }, window.location.origin);
            
            // Clear the hash and close popup
            window.history.replaceState(null, '', window.location.pathname);
            window.close();
          } else {
            // No opener - this might be main window after redirect
            // Clear the hash to prevent re-processing
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          
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
      // This will handle the popup callback and send message to parent
      this.checkUrlForToken();
      
      // Check if token is expired
      if (this.tokenExpiresAt && Date.now() >= this.tokenExpiresAt - 300000) {
        console.log('⚠️ Token expired or expiring soon, need to re-authenticate');
        await this.disconnect();
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
        
        // IMPORTANT: Try to open in a new tab to avoid "disallowed_useragent" error
        // This ensures Google sees it as a proper browser, not a webview
        const newWindow = window.open(authUrl.toString(), '_blank');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Popup was blocked - fall back to same-window redirect
          console.warn('Popup blocked, falling back to same-window redirect');
          window.location.href = authUrl.toString();
        }
        
        // Return false because auth will complete when user returns to the app
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
        
        // Calculate expiry time (default 1 hour if not provided)
        const expiresIn = parseInt(result.params.expires_in || '3600');
        this.tokenExpiresAt = Date.now() + (expiresIn * 1000);
        
        await storage.setItem("google_fit_token", this.accessToken);
        await storage.setItem("google_fit_token_expiry", this.tokenExpiresAt.toString());
        
        console.log('✅ Token saved with expiry:', new Date(this.tokenExpiresAt).toLocaleString());
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
      const storedExpiry = await storage.getItem("google_fit_token_expiry");
      
      if (storedToken && storedExpiry) {
        const expiresAt = parseInt(storedExpiry);
        const now = Date.now();
        
        // Check if token is still valid (with 5 min buffer)
        if (expiresAt > now + 300000) {
          this.accessToken = storedToken;
          this.tokenExpiresAt = expiresAt;
          this.isAuthorized = true;
        } else {
          console.log('⚠️ Token expired during check');
          await this.disconnect();
        }
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
   * Enable mock data mode for testing without Android device
   */
  enableMockData(enabled: boolean = true): void {
    this.useMockData = enabled;
    console.log(`Mock data mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Get today's total steps
   */
  async getTodaySteps(): Promise<number> {
    await this.ensureAuthorized();

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = Date.now();

    try {
      return await this.fetchStepCount(startOfDay, endOfDay);
    } catch (error: any) {
      // If no data source available and mock mode enabled, return mock data
      if (this.useMockData && error.message.includes('datasource not found')) {
        console.warn('⚠️ No real step data available. Using mock data for development.');
        console.warn('📱 To get real data: Install Google Fit on an Android device and record steps.');
        const mockSteps = Math.floor(Math.random() * 8000) + 2000; // Random 2000-10000
        return mockSteps;
      }
      throw error;
    }
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
    await storage.deleteItem("google_fit_token_expiry");
    this.accessToken = null;
    this.tokenExpiresAt = null;
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

      // Request step data from ALL available sources
      // Don't specify dataSourceId to get data from any source the user has
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
                // Don't specify dataSourceId - let Google Fit return data from any available source
              },
            ],
            bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
            startTimeMillis,
            endTimeMillis,
          }),
        }
      );

      console.log('API Response Status:', response.status);

      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('🔒 Authentication error - token expired');
        // Clear invalid token
        await this.disconnect();
        throw new Error('TOKEN_EXPIRED');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Full error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        
        // Parse error to provide helpful message
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message?.includes('datasource not found')) {
            throw new Error('No step data available. Google Fit may not have any recorded steps for this account. Try using the Google Fit app on an Android device to record steps first.');
          }
        } catch (e) {
          // If parsing fails, use original error
        }
        
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
