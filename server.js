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
// const corsOptions = {
//     origin: 'https://7things-api.onrender.com/',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204 // For legacy browser support
// };

app.use(express.json());
app.use(cors());


const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);
const todoRoutes = require('./routes/todo');
app.use('/', todoRoutes);




const PORT = process.env.PORT || 5000;

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString,{
      serverSelectionTimeoutMS: 30000,  // 30 seconds for server selection
      socketTimeoutMS: 45000,           // 45 seconds for socket operations
      maxPoolSize: 10,                  // Reduce connection pool size
      minPoolSize: 2,                   // Maintain minimum connections
      heartbeatFrequencyMS: 10000,      // Send pings more frequently
    }).then(() => console.log('connect to DB...')).catch(err => console.log(err));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})