import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken';

export function decodeLinkedInIdToken(idToken: string) {
  const decoded = jwt.decode(idToken) as JwtPayload | null;

  if (!decoded || !decoded.email || !decoded.sub) {
    throw new Error("Invalid LinkedIn token");
  }

  return decoded;
}