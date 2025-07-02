const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const e = require('express');
const jwt = require('jsonwebtoken');

// const { authenticateToken } = require('./utilities');
const User = require('./models/user');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);
const todoRoutes = require('./routes/todo');
app.use('/', todoRoutes);




const PORT = process.env.PORT || 5000;

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString).then(() => console.log('connect to DB...')).catch(err => console.log(err));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})