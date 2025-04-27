import express from 'express';

const app = express();
const PORT = 600;

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'response from default slash route' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
