import prisma from '../../prisma/index.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

    // 4. if not exist, create new user in db
    const newUser = await prisma.user.create({
      data: { name, email, password },
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
      text: `Hello ${newUser.name}, Welcome to codearena portal \n Please click the given link to verify your identity: ${process.env.BASE_URL}/verification/${token}`,
    };

    await transporter.sendMail(mailOptions);

    // 8. return success message
    return res
      .status(200)
      .json({ message: 'user created successfully', success: true });
  } catch (error) {}
};

const userVerification = async (req, res) => {};

export { userRegistration, userVerification };
