import express from 'express';
import {
  userRegistration,
  userVerification,
} from '../controllers/auth.controllers.js';

const authRoute = express.Router();

authRoute.post('/registration', userRegistration);
authRoute.post('/verification/:token', userVerification);

export default authRoute;
