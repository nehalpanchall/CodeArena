import jwt from 'jsonwebtoken';

const isLoggedIn = async (req, res, next) => {
  try {
    // 1. get get jwtToken from req object
    const token = req.cookies?.jwtToken;

    // 2. validate jwtToken
    if (!token) {
      return res.status(400).json({ message: 'invalid token', success: false });
    }

    // 3. if valid token, decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 4. inject the decoded token object into req object
    req.user = decodedToken;

    // 5. next flag
    next();
  } catch (error) {}
};

export default isLoggedIn;
