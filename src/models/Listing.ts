import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        suburb: { type: String },
        price: { type: String, required: true },
        beds: { type: Number },
        baths: { type: Number },
        isActive: { type: Boolean, default: true },
        agentName: { type: String },
        agentPhone: { type: String },
        agentRole: { type: String },
    },
    { timestamps: true },
);

const Listing = mongoose.model('Listing', ListingSchema);
export default Listing;
