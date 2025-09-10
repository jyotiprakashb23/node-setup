import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    clients:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Admin = model('Admin', adminSchema);

export default Admin;