import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User collection
            required: true,
        },
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User collection
            required: true,
        },
        bloodGroupNeeded: {
            type: String,
            required: true,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Request = mongoose.model('Request', requestSchema);
export default Request;