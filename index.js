import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3300;

app.use(express.json()); // parse JSON data
app.use(cookieParser()); // allow cookies
app.use(express.urlencoded({ extended: true })); // parse URL encoded data

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'response from default slash route' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
