const { authenticateToken } = require('../utilities');
console.log('authenticateToken:', authenticateToken);

const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require('../models/user');
// const { authenticateToken } = require('../utilities');
// const { authenticateToken } = require('../utilities');
// const validatePassword = (password) => {
//     const minLength = 6;
//     const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    
//     if (password.length < minLength) {
//       return false;
//     }
//     if (!specialCharPattern.test(password)) {
//       return false;
//     }
//     return true;
//   };

   const validatePassword = (password) => {
        // Basic validation: at least 8 characters, one uppercase, one lowercase, one number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        console.log('Validating password:', password);
        return regex.test(password);
    }

router.post('/create-account', async (req, res) => {
    // const { fullName, email, password } = req.body;

    // if (!fullName.trim() || !email.trim() || !password.trim()) {
    //     return res.status(400).json({ message: 'All fields are required' });
    // }
    //  if (validatePassword(password) === false){
    //     return res.status(400).json({ error: true, message: "Password does not meet requirements" });
    // }

    // try {
    //     const existingUser = await User.findOne({ email });
    //     if (existingUser) {
    //         return res.status(400).json({ message: 'User already exists' });
    //     }

    //     const user  = new User({ fullName, email, password });
    //     await user.save();
    //     const accessToken = jwt.sign({ user:user }, process.env.JWT_SECRET, { expiresIn: "10h" });
    //     return res.json({ error: false, user , accessToken, message: "Registration Successful" });
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }

       const { fullName, email, password } = req.body;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (validatePassword(password) === false){
        return res.status(400).json({ error: true, message: "Password does not meet requirements" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user  = new User({ fullName, email, password });
        await user.save();

        // Only include non-sensitive fields in the JWT and response
        const safeUser = { _id: user._id, fullName: user.fullName, email: user.email, createdOn: user.createdOn };
        const accessToken = jwt.sign({ user: safeUser }, process.env.JWT_SECRET, { expiresIn: "10h" });

        return res.json({ error: false, user: safeUser, accessToken, message: "Registration Successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request received:', { email, password });

    if (!email.trim() || !password.trim()) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userInfo = await User.findOne({ email });
        if (!userInfo || userInfo.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
         const safeUser = { _id: userInfo._id, fullName: userInfo.fullName, email: userInfo.email, createdOn: userInfo.createdOn };
        const accessToken = jwt.sign({ user: safeUser }, process.env.JWT_SECRET, { expiresIn: "10h" });
        return res.json({ error: false, message: "Login Successful", email, accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get("/get-user", authenticateToken, async (req, res) => {
    const  user  = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: { fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn },
        message: "",
    });
});

module.exports = router;