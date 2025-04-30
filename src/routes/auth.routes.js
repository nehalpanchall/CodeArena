import express from 'express';
import {
  userLogin,
  userRegistration,
  userVerification,
} from '../controllers/auth.controllers.js';

const authRoute = express.Router();

authRoute.post('/registration', userRegistration);
authRoute.post('/verification/:token', userVerification);
authRoute.post('/login', userLogin);

export default authRoute;
