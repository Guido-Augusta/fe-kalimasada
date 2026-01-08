import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  exp: number; 
  iat: number; 
  [key: string]: string | number | boolean | unknown;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Token expired");
    }
    return true;
  }
}
