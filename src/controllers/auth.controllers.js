import prisma from '../../prisma/index.js';

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
    // 5. generate random token
    // 6. store token in db
    // 7. send token to user via email
    // 8. return success message
  } catch (error) {}
};

export { userRegistration };
