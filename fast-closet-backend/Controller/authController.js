const User = require('../Model/userModel');

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.password !== password) return res.status(401).json({ message: "Invalid password" });
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { signup, login };