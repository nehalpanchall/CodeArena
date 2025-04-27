import express from 'express';

const app = express();
const PORT = 600;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
