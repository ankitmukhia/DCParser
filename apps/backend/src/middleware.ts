import { type Request, type Response, type NextFunction } from "express";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.user = session.user;
  next();
};
