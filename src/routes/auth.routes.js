import express from 'express';
import { userRegistration } from '../controllers/auth.controllers.js';

const authRoute = express.Router();

authRoute.post('/registration', userRegistration);

export default authRoute;
