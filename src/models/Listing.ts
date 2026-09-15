import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        suburb: { type: String },
        price: { type: String, required: true },
        beds: { type: Number },
        baths: { type: Number },
        carSpaces: { type: Number },
        isActive: { type: Boolean, default: true },
        contacts: [{ name: { type: String }, phone: { type: String } }],
    },
    { timestamps: true },
);

const Listing = mongoose.model('Listing', ListingSchema);
export default Listing;
