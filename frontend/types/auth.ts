export interface UserRegister {
    email: string;
    password: string;
  }
  
  export interface UserLogin {
    email: string;
    password: string;
  }
  
  export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    is_onboarded: boolean;
  }
  
  export interface TokenRefreshRequest {
    refresh_token: string;
  }
  
  export interface PasswordResetRequest {
    email: string;
  }
  
  export interface PasswordResetConfirm {
    token: string;
    new_password: string;
  }
  
  export interface ResendVerificationRequest {
    email: string;
  }