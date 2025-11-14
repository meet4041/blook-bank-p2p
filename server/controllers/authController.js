import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Helper function to create a token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will be valid for 30 days
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, city, bloodGroup, registrationID } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the new user
        // Password hashing is handled by the 'pre-save' hook in your userModel
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            city,
            bloodGroup, // Will be null if role is 'hospital'
            registrationID, // Will be null if role is 'donor'
            isVerified: role === 'hospital' ? false : true, // Hospitals must be verified
        });

        // 3. Send back user data and a token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

/**
 * @desc    Authenticate/login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. Check if user exists and password matches
        // We use the comparePassword method we created in the userModel
        if (user && (await user.comparePassword(password))) {
            // 3. Send back user data and a token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

/**
 * @desc    
 * @route   
 * @access  
 */
export const getMe = async (req, res) => {
    res.status(200).json(req.user);
};