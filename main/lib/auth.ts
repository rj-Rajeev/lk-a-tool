import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AppTokenPayload = {
  userId: number;
  email: string;
  picture: string;
};

export const getAuth = async (): Promise<AppTokenPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("AppToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AppTokenPayload;

    return payload;
  } catch {
    return null;
  }
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET must be set');
  return secret;
};

export const signToken = (payload: object) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });

export const verifyToken = (token: string) =>
  jwt.verify(token, getJwtSecret());
