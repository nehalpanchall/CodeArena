import express from 'express';
import {
  forgotPassword,
  resetPassword,
  userLogin,
  userLogout,
  userProfile,
  userRegistration,
  userVerification,
} from '../controllers/auth.controllers.js';

import isLoggedIn from '../middlewares/auth.middlewares.js';

const authRoute = express.Router();

authRoute.post('/registration', userRegistration);
authRoute.post('/verification/:token', userVerification);
authRoute.post('/login', userLogin);

authRoute.get('/profile', isLoggedIn, userProfile);
authRoute.get('/logout', isLoggedIn, userLogout);

authRoute.post('/forgotpassword', forgotPassword);
authRoute.post('/resetpassword/:token', resetPassword);

export default authRoute;
