import { AuthProvider } from "./entities/auth.entity.ts";

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email?: boolean;
  name: string;
  picture: string;
}

export interface GitHubUserInfo {
  id: number;
  login: string;
  email: string | null;
  avatar_url: string;
  name: string;
}

export interface OAuthProfile {
  username?: string;
  avatar?: string;
  email?: string;
}

export interface OAuthAuthentication {
  provider: AuthProvider.GOOGLE | AuthProvider.GITHUB;
  subject: string;
  profile: OAuthProfile;
  verifiedEmail: boolean;
  token: OAuthTokenResponse;
}
