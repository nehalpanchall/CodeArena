import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3300;

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'response from default slash route' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
