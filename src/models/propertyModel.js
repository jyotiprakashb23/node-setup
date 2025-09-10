import { Schema, model } from "mongoose";

const propertySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        trim: true,
        index: true 
    },
    propertyType: {
        type: String,
        required: true,
        enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Land'],
        index: true // index for property type filtering
    },
    listedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    images: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['Available', 'Pending', 'Sold'],
        default: 'Available',
        index: true // index for status filtering
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for common queries (e.g., location + status)
propertySchema.index({ location: 1, status: 1 });

const Property = model('Property', propertySchema);
export default Property;
