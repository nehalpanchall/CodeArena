import express from 'express';
import {
  userLogin,
  userProfile,
  userRegistration,
  userVerification,
} from '../controllers/auth.controllers.js';

const authRoute = express.Router();

authRoute.post('/registration', userRegistration);
authRoute.post('/verification/:token', userVerification);
authRoute.post('/login', userLogin);

authRoute.get('/profile', userProfile);

export default authRoute;
