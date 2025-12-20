import axios, { AxiosInstance } from 'axios';
import { TrueLayerAuthResponse } from './types';
import { ConnectorCredentials } from '../base-connector';

const TRUELAYER_AUTH_URL = 'https://auth.truelayer.com';
const TRUELAYER_API_URL = 'https://api.truelayer.com';

export class TrueLayerAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private httpClient: AxiosInstance;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.httpClient = axios.create({
      baseURL: TRUELAYER_AUTH_URL,
    });
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'info accounts transactions balance cards investments',
      ...(state && { state }),
    });

    return `${TRUELAYER_AUTH_URL}/connect/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TrueLayerAuthResponse> {
    try {
      const response = await this.httpClient.post<TrueLayerAuthResponse>(
        '/connect/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TrueLayerAuthResponse> {
    try {
      const response = await this.httpClient.post<TrueLayerAuthResponse>(
        '/connect/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert TrueLayer auth response to connector credentials
   */
  toCredentials(authResponse: TrueLayerAuthResponse): ConnectorCredentials {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + authResponse.expires_in);

    return {
      accessToken: authResponse.access_token,
      refreshToken: authResponse.refresh_token,
      expiresAt,
    };
  }
}

