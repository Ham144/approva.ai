import jwt from "jsonwebtoken";

/**
 * Optional authentication middleware.
 * Sets req.user if a valid token exists, but does NOT reject unauthenticated requests.
 * Routes that need strict auth should check req.user themselves.
 */
const optionalAuthenticate = (req, res, next) => {
  const token =
    req?.cookies?.token || req.headers.authorization?.split(" ")[1] || null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export default optionalAuthenticate;
