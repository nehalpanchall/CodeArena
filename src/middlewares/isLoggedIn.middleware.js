const isLoggedIn = async (req, res) => {
  // 1. get get jwtToken from req object
  const token = req.cookies?.jwtToken;

  // 2. validate jwtToken
  // 3. if valid token, decode the token
  // 4. inject the decoded token object into req object
  // 5. next flag
};

export default isLoggedIn;
