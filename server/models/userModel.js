import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['donor', 'hospital', 'admin'],
            required: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        address: {
            type: String,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },

        // --- Donor-Specific Fields ---
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        availability: {
            type: String,
            enum: ['available', 'unavailable'],
            default: 'available',
        },

        // --- Hospital-Specific Fields ---
        registrationID: {
            type: String, // Official hospital registration number
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// --- Mongoose Middleware to Hash Password ---
// This function runs *before* a new user is saved
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Mongoose Method to Compare Passwords ---
// This adds a custom method to all user documents
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;