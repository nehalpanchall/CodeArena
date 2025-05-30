import jwt from 'jsonwebtoken';
import prisma from '../../prisma/index.js';
import { Role } from '../generated/prisma/index.js';

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

export const isAdmin = async (req, res, next) => {
  // 1. get the userId from req.user
  const { id } = req.user;

  try {
    // 2. get the user from db based on userId
    const user = await prisma.user.findUnique({ where: { id } });

    // 3. validate the user
    if (!user) {
      return res.status(400).json({ message: 'invalid user', success: false });
    }

    // 4. check user role is ADMIN
    if (user.role !== 'ADMIN' || user.role === 'USER') {
      return res
        .status(400)
        .json({ message: 'access denied: Admin only', success: false });
    }

    // 5. next()
    next();
  } catch (error) {}
};

export default isLoggedIn;
