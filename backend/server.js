const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/' , (req , res) => {
    res.send('Server Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);
})