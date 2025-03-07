export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
}

export interface AuthError {
  message:string,
  status:number
}

export interface JwtResponse {
  token: string;
  refreshToken: string;
  message: string;
  user: User;
  error?: boolean;
}

export interface TokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: 'ADMIN' | 'CLIENT';
}
