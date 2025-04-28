const userRegistration = async (req, res) => {
  // 1. get the data from body
  const { name, email, password } = req.body;

  // 2. validate data
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'user credentials are required', success: false });
  }
  // 3. check user exist or not in db
  // 4. if not exist, create new user in db
  // 5. generate random token
  // 6. store token in db
  // 7. send token to user via email
  // 8. return success message
};

export { userRegistration };
