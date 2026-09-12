export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface GitHubUserInfo {
  id: number;
  login: string;
  email: string;
  avatar_url: string;
  name: string;
}
