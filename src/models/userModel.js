import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
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
        required: true,
        minlength: 6
    },
        role: {
        type: String,
        default: 'user'
    },
    handledBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.index({ email: 1 }, { unique: true });

const User = model('User', userSchema);

export default User;