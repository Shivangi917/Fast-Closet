const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const authRouter = require('./Router/authRouter');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})