import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './src/routes/auth.routes.js';
import problemsRoute from './src/routes/problems.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3300;

app.use(express.json()); // parse JSON data
app.use(cookieParser()); // allow cookies
app.use(express.urlencoded({ extended: true })); // parse URL encoded data
app.use(cors({ origin: 'your frontend urls', credentials: true }));

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'response from default slash route' });
});

app.use('/auth/v1/api', authRoute);
app.use('/api/v1/problems', problemsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
