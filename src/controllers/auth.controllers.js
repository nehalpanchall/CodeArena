import prisma from '../../prisma/index.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRegistration = async (req, res) => {
  // 1. get the data from body
  const { name, email, password } = req.body;

  // 2. validate data
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'user credentials are required', success: false });
  }

  try {
    // 3. check user exist or not in db
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: 'user already exist', success: false });
    }

    // hashed string password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. if not exist, create new user in db
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 5. generate random token
    const token = crypto.randomBytes(16).toString('hex');

    if (!token) {
      return res
        .status(400)
        .json({ message: 'failed to generate token', success: false });
    }

    // 6. store token in db
    await prisma.user.update({
      where: { email },
      data: { verificationToken: token },
    });

    // 7. send token to user via email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAIL_SENDER, // sender address
      to: newUser.email, // list of receivers
      subject: 'User verification required! ✔', // Subject line
      text: `Hello ${newUser.name}, Welcome to codearena portal \n Please click the given link to verify your identity: ${process.env.BASE_URL}/auth/v1/api/verification/${token}`,
    };

    await transporter.sendMail(mailOptions);

    // 8. return success message
    return res
      .status(200)
      .json({ message: 'user created successfully', success: true });
  } catch (error) {}
};

const userVerification = async (req, res) => {
  // 1. get the token from req.params
  const { token } = req.params; // req.params.token

  // 2. verify token
  if (!token) {
    return res.status(401).json({ message: 'invalid token', success: false });
  }

  try {
    // 3. find the user from db based on token
    const existingUser = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!existingUser) {
      return res.status(401).json({ message: 'invalid token', success: false });
    }

    // 4. update the fields in user db
    await prisma.user.update({
      where: { id: existingUser.id }, // any @unique field
      data: { isVerified: true, verificationToken: null },
    });

    // 5. return success reponse
    return res
      .status(200)
      .json({ message: 'user verified successfully', success: true });
  } catch (error) {}
};

const userLogin = async (req, res) => {
  // 1. get the data from body
  const { email, password } = req.body;

  // 2. validate data
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'invalid credentials, try again', success: false });
  }

  try {
    // 3. check email in db
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: 'user does not exist', success: false });
    }

    // 4. check password is correct
    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'incorrect password', success: false });
    }

    // 5. check user is verified
    if (!existingUser.isVerified) {
      return res.status(401).json({
        message: 'user verification is required before login',
        success: false,
      });
    }

    // 6. generate jwt token
    const token = jwt.sign(
      { id: existingUser.id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRIES_IN }
    );

    // 7. set jwt token in cookie
    const cookieOptions = {
      httpOnly: true, // cookie in backend control
      maxAge: 24 * 60 * 60 * 1000, // 24h
    };

    res.cookie('jwtToken', token, cookieOptions);

    // 8. return success response with data
    return res.status(200).json({
      message: 'user logged in successfully',
      success: true,
      token,
      user: {
        id: existingUser.id,
        role: existingUser.role,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {}
};

const userProfile = async (req, res) => {
  // 1. get the user object from req
  // 2. validate user object
  // 3. extract user id from user object
  // 4. find the user from db base on user id
  // 5. print all the user data
  // 6. return success response
};

export { userRegistration, userVerification, userLogin, userProfile };
