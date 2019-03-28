export interface LoginResponse {
  success: boolean;
  expiresIn: number,
  accessToken: string,
  userId: number,
}